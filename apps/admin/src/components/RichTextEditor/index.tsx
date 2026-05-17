import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Button, Divider, Input, Modal, Space, Tooltip } from 'antd';
import { useState } from 'react';
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  StrikethroughOutlined,
  UnorderedListOutlined,
  OrderedListOutlined,
  FontSizeOutlined,
  LinkOutlined,
  PictureOutlined,
  VideoCameraOutlined,
  FormatPainterOutlined,
  RedoOutlined,
  UndoOutlined,
} from '@ant-design/icons';

interface Props {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: Props) {
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Strike,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      Placeholder.configure({
        placeholder: placeholder || '请输入内容...',
      }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const handleAddLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
    }
    setLinkUrl('');
    setLinkModalOpen(false);
  };

  const handleAddImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
    }
    setImageUrl('');
    setImageModalOpen(false);
  };

  const handleAddVideo = () => {
    if (videoUrl) {
      const videoHtml = `<div class="video-wrapper"><iframe src="${videoUrl}" frameborder="0" allowfullscreen style="width:100%;aspect-ratio:16/9;"></iframe></div>`;
      editor.chain().focus().insertContent(videoHtml).run();
    }
    setVideoUrl('');
    setVideoModalOpen(false);
  };

  const toolbarGroups = [
    // History
    [
      {
        icon: <UndoOutlined />,
        title: '撤销',
        action: () => editor.chain().focus().undo().run(),
        isActive: () => false,
      },
      {
        icon: <RedoOutlined />,
        title: '重做',
        action: () => editor.chain().focus().redo().run(),
        isActive: () => false,
      },
    ],
    // Formatting
    [
      {
        icon: <BoldOutlined />,
        title: '粗体 (Ctrl+B)',
        action: () => editor.chain().focus().toggleBold().run(),
        isActive: () => editor.isActive('bold'),
      },
      {
        icon: <ItalicOutlined />,
        title: '斜体 (Ctrl+I)',
        action: () => editor.chain().focus().toggleItalic().run(),
        isActive: () => editor.isActive('italic'),
      },
      {
        icon: <UnderlineOutlined />,
        title: '下划线',
        action: () => editor.chain().focus().toggleUnderline().run(),
        isActive: () => editor.isActive('underline'),
      },
      {
        icon: <StrikethroughOutlined />,
        title: '删除线',
        action: () => editor.chain().focus().toggleStrike().run(),
        isActive: () => editor.isActive('strike'),
      },
    ],
    // Headings
    [
      {
        icon: <FontSizeOutlined />,
        title: '标题 H2',
        action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        isActive: () => editor.isActive('heading', { level: 2 }),
      },
      {
        icon: <FormatPainterOutlined />,
        title: '段落',
        action: () => editor.chain().focus().setParagraph().run(),
        isActive: () => editor.isActive('paragraph'),
      },
    ],
    // Lists
    [
      {
        icon: <UnorderedListOutlined />,
        title: '无序列表',
        action: () => editor.chain().focus().toggleBulletList().run(),
        isActive: () => editor.isActive('bulletList'),
      },
      {
        icon: <OrderedListOutlined />,
        title: '有序列表',
        action: () => editor.chain().focus().toggleOrderedList().run(),
        isActive: () => editor.isActive('orderedList'),
      },
    ],
    // Media
    [
      {
        icon: <LinkOutlined />,
        title: '插入链接',
        action: () => {
          const previousUrl = editor.getAttributes('link').href;
          setLinkUrl(previousUrl || '');
          setLinkModalOpen(true);
        },
        isActive: () => editor.isActive('link'),
      },
      {
        icon: <PictureOutlined />,
        title: '插入图片',
        action: () => setImageModalOpen(true),
        isActive: () => false,
      },
      {
        icon: <VideoCameraOutlined />,
        title: '插入视频',
        action: () => setVideoModalOpen(true),
        isActive: () => false,
      },
    ],
  ];

  return (
    <div className="rich-text-editor border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-200 px-3 py-2">
        <Space size={4} split={<Divider type="vertical" className="mx-1" />}>
          {toolbarGroups.map((group, groupIndex) => (
            <Space key={groupIndex} size={4}>
              {group.map((item, index) => (
                <Tooltip key={index} title={item.title}>
                  <Button
                    type={item.isActive() ? 'primary' : 'text'}
                    size="small"
                    icon={item.icon}
                    onClick={item.action}
                  />
                </Tooltip>
              ))}
            </Space>
          ))}
        </Space>
      </div>
      <div className="p-3 min-h-[200px] prose max-w-none">
        <EditorContent editor={editor} />
      </div>

      {/* Link Modal */}
      <Modal
        title="插入链接"
        open={linkModalOpen}
        onOk={handleAddLink}
        onCancel={() => {
          setLinkModalOpen(false);
          setLinkUrl('');
        }}
        okText="插入"
        cancelText="取消"
      >
        <Input
          placeholder="请输入链接地址，例如：https://www.example.com"
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
        />
      </Modal>

      {/* Image Modal */}
      <Modal
        title="插入图片"
        open={imageModalOpen}
        onOk={handleAddImage}
        onCancel={() => {
          setImageModalOpen(false);
          setImageUrl('');
        }}
        okText="插入"
        cancelText="取消"
      >
        <Input
          placeholder="请输入图片地址，例如：https://www.example.com/image.jpg"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <div className="mt-4">
          <p className="text-sm text-gray-500">
            提示：可以从多媒体库复制图片地址粘贴到这里
          </p>
        </div>
      </Modal>

      {/* Video Modal */}
      <Modal
        title="插入视频"
        open={videoModalOpen}
        onOk={handleAddVideo}
        onCancel={() => {
          setVideoModalOpen(false);
          setVideoUrl('');
        }}
        okText="插入"
        cancelText="取消"
      >
        <Input
          placeholder="请输入视频嵌入地址，例如：https://www.youtube.com/embed/..."
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />
        <div className="mt-4">
          <p className="text-sm text-gray-500">
            支持 YouTube、Bilibili 等视频嵌入链接
          </p>
        </div>
      </Modal>
    </div>
  );
}
