import {readFile, readdir, rename, stat, unlink, writeFile} from "node:fs/promises";
import {basename, extname, resolve} from "node:path";
import {fileURLToPath} from "node:url";

import {put} from "@vercel/blob";
import sharp from "sharp";

const appDirectory = resolve(fileURLToPath(new URL("..", import.meta.url)));
const repositoryDirectory = resolve(appDirectory, "../..");
const imagesDirectory = resolve(repositoryDirectory, "images");
const certificateContentPath = resolve(
  appDirectory,
  "src/content/pages/certificates.ts",
);
const blobDirectory = "yaoshun-assets/site/about/certificates";
const publicMediaBaseUrl = "https://www.yaoshuntoys.com/media";
const shouldUploadImages = process.argv.includes("--upload");
const shouldUploadPdfs = shouldUploadImages || process.argv.includes("--upload-pdfs");
const pdfDirectory = resolve(repositoryDirectory, "pdf");

const certificatePdfBySource = new Map([
  [
    "6487034-英国外观专利申请证书.pdf",
    "uk-design-registration-6487034.pdf",
  ],
  ["CE COC.pdf", "ce-certificate-of-conformity.pdf"],
  ["CPC.pdf", "us-childrens-product-certificate.pdf"],
  ["EFW726054129-T-01.pdf", "eurofins-test-report-efw726054129.pdf"],
  ["一种玩具球.pdf", "cn-utility-model-patent-toy-ball.pdf"],
  [
    "东莞市尧顺科技有限公司-QMS证书IAS_扫描版.pdf",
    "cn-iso-9001-qms-certificate.pdf",
  ],
]);

const MAX_WIDTH = 1600;
const MAX_HEIGHT = 1800;
const WEBP_QUALITY = 86;

const certificateConstantByFilename = new Map([
  ["uk-design-registration-6487034.webp", "ukDesignRegistration"],
  [
    "eu-eurofins-test-report-efw726054129-page-01.webp",
    "eurofinsTestReport",
  ],
  [
    "us-childrens-product-certificate.webp",
    "childrensProductCertificate",
  ],
  ["eu-euipo-design-registration.webp", "euipoDesignRegistration"],
  ["cn-iso-9001-certificate-page-01.webp", "qmsCertificateChinese"],
  ["cn-iso-9001-certificate-page-02.webp", "qmsCertificateEnglish"],
  [
    "cn-trademark-registration-leyidi.webp",
    "leyidiTrademarkRegistration",
  ],
  [
    "cn-trademark-registration-londy.webp",
    "londyTrademarkRegistration",
  ],
  ["cn-ccc-product-certificate.webp", "cccProductCertificate"],
  ["cn-ccc-test-report-cover.webp", "cccTestReportCover"],
  [
    "eu-ce-certificate-of-compliance.webp",
    "ceCertificateOfCompliance",
  ],
  ["cn-utility-model-patent-toy-ball.webp", "utilityModelPatent"],
  [
    "us-childrens-product-certificate-highlighted.webp",
    "highlightedChildrensProductCertificate",
  ],
]);

function toSlug(filename) {
  return basename(filename, extname(filename))
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’]/g, "")
    .replace(/&/g, "-and-")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function toPublicMediaUrl(pathname, etag) {
  const blobPrefix = "yaoshun-assets/";
  if (!pathname.startsWith(blobPrefix)) {
    throw new Error(`Unexpected Blob pathname: ${pathname}`);
  }

  const publicPathname = pathname.slice(blobPrefix.length);
  const url = new URL(`${publicMediaBaseUrl}/${publicPathname}`);
  url.searchParams.set("v", etag.replaceAll('"', ""));
  return url.toString();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function optimizeImage(filename) {
  const sourcePath = resolve(imagesDirectory, filename);
  const sourceExtension = extname(filename).toLowerCase();
  const outputFilename = `${toSlug(filename)}.webp`;
  const outputPath = resolve(imagesDirectory, outputFilename);
  const temporaryPath = resolve(imagesDirectory, `.${outputFilename}.tmp`);
  const sourceMetadata = await sharp(sourcePath).metadata();
  const sourceSize = (await stat(sourcePath)).size;
  const isAlreadySuitableWebp =
    sourceExtension === ".webp" &&
    sourceMetadata.width <= MAX_WIDTH &&
    sourceMetadata.height <= MAX_HEIGHT;

  if (isAlreadySuitableWebp) {
    if (sourcePath !== outputPath) {
      await rename(sourcePath, outputPath);
    }

    return {
      filename: outputFilename,
      path: outputPath,
      sourceSize,
      outputSize: sourceSize,
      width: sourceMetadata.width,
      height: sourceMetadata.height,
      converted: false,
    };
  }

  await sharp(sourcePath)
    .rotate()
    .resize({
      width: MAX_WIDTH,
      height: MAX_HEIGHT,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({quality: WEBP_QUALITY, effort: 6, smartSubsample: true})
    .toFile(temporaryPath);

  await rename(temporaryPath, outputPath);
  if (sourcePath !== outputPath) {
    await unlink(sourcePath);
  }

  const outputMetadata = await sharp(outputPath).metadata();
  return {
    filename: outputFilename,
    path: outputPath,
    sourceSize,
    outputSize: (await stat(outputPath)).size,
    width: outputMetadata.width,
    height: outputMetadata.height,
    converted: true,
  };
}

async function updateCertificateUrls(urlByFilename) {
  let source = await readFile(certificateContentPath, "utf8");

  for (const [filename, constantName] of certificateConstantByFilename) {
    const url = urlByFilename.get(filename);
    if (!url) {
      throw new Error(`Missing uploaded URL for ${filename}`);
    }

    const declarationPattern = new RegExp(
      `(const ${constantName} =\\n  ")[^"]+(";)`,
    );
    if (!declarationPattern.test(source)) {
      throw new Error(`Could not find ${constantName} in certificates.ts`);
    }
    source = source.replace(declarationPattern, `$1${url}$2`);
  }

  await writeFile(certificateContentPath, source);
}

async function updateCertificateDocumentUrls(urlByFilename) {
  let source = await readFile(certificateContentPath, "utf8");

  for (const filename of certificatePdfBySource.values()) {
    const url = urlByFilename.get(filename);
    if (!url) {
      throw new Error(`Missing uploaded PDF URL for ${filename}`);
    }

    const filenamePattern = escapeRegExp(filename);
    source = source.replace(
      new RegExp(`(documentUrl: )"[^"]*${filenamePattern}[^"]*"`, "g"),
      `$1"${url}"`,
    );
  }

  await writeFile(certificateContentPath, source);
}

const filenames = (await readdir(imagesDirectory))
  .filter((filename) => /\.(?:png|jpe?g|webp)$/i.test(filename))
  .sort();

if (filenames.length === 0) {
  throw new Error(`No supported images found in ${imagesDirectory}`);
}

const outputNames = filenames.map((filename) => `${toSlug(filename)}.webp`);
if (new Set(outputNames).size !== outputNames.length) {
  throw new Error("Multiple source images would produce the same WebP filename");
}

const optimizedImages = [];
for (const filename of filenames) {
  const result = await optimizeImage(filename);
  optimizedImages.push(result);
  const action = result.converted ? "optimized" : "ready";
  console.log(
    `${action.padEnd(9)} ${result.filename} (${result.width}x${result.height}, ${formatBytes(result.sourceSize)} -> ${formatBytes(result.outputSize)})`,
  );
}

if (!shouldUploadImages && !shouldUploadPdfs) {
  console.log(
    `Prepared ${optimizedImages.length} WebP images. Run with --upload-pdfs to publish certificate PDFs, or --upload for both images and PDFs.`,
  );
  process.exit(0);
}

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  throw new Error(
    "BLOB_READ_WRITE_TOKEN is required. Load apps/website/.env.local before uploading.",
  );
}

const urlByFilename = new Map();
if (shouldUploadImages) {
  for (const image of optimizedImages) {
    const pathname = `${blobDirectory}/${image.filename}`;
    const body = await readFile(image.path);
    const blob = await put(pathname, body, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "image/webp",
      // The public URL includes the ETag so overwrites receive a fresh cache key.
      cacheControlMaxAge: 60 * 60 * 24 * 30,
    });
    urlByFilename.set(image.filename, toPublicMediaUrl(blob.pathname, blob.etag));
    console.log(`uploaded  ${pathname}`);
  }

  await updateCertificateUrls(urlByFilename);
}

if (shouldUploadPdfs) {
  for (const [sourceFilename, publicFilename] of certificatePdfBySource) {
    const sourcePath = resolve(pdfDirectory, sourceFilename);
    const body = await readFile(sourcePath);
    const pathname = `${blobDirectory}/${publicFilename}`;
    const blob = await put(pathname, body, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/pdf",
      cacheControlMaxAge: 60 * 60 * 24 * 30,
    });
    urlByFilename.set(publicFilename, toPublicMediaUrl(blob.pathname, blob.etag));
    console.log(`uploaded  ${pathname}`);
  }

  await updateCertificateDocumentUrls(urlByFilename);
}

console.log(
  `Uploaded ${shouldUploadImages ? optimizedImages.length : 0} images and ${shouldUploadPdfs ? certificatePdfBySource.size : 0} PDFs; updated ${certificateContentPath}.`,
);
