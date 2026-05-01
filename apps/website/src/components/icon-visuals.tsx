import type {LucideIcon} from 'lucide-react';
import {
  BadgeCheck,
  Blocks,
  Bot,
  Boxes,
  CircuitBoard,
  ClipboardList,
  Cog,
  Factory,
  FileText,
  Globe2,
  Layers3,
  Package,
  ShieldCheck,
  Truck,
  Users,
  Workflow,
  Wrench
} from 'lucide-react';

type VisualTheme = {
  shell: string;
  panel: string;
  iconWrap: string;
  iconColor: string;
  line: string;
  dot: string;
};

type VisualCardProps = {
  icon: LucideIcon;
  label: string;
  theme?: Partial<VisualTheme>;
  compact?: boolean;
};

const baseTheme: VisualTheme = {
  shell: 'bg-gradient-to-br from-slate-50 via-white to-slate-100',
  panel: 'bg-white/82',
  iconWrap: 'bg-primary/10',
  iconColor: 'text-primary',
  line: 'bg-primary/10',
  dot: 'bg-secondary/80'
};

function mergeTheme(theme?: Partial<VisualTheme>): VisualTheme {
  return {...baseTheme, ...theme};
}

export function VisualCard({icon: Icon, label, theme, compact = false}: VisualCardProps) {
  const mergedTheme = mergeTheme(theme);

  return (
    <div className={`relative overflow-hidden rounded-[2rem] ${mergedTheme.shell} ${compact ? 'p-4 sm:p-5' : 'p-5 sm:p-6 lg:p-8'}`}>
      <div className="absolute inset-x-0 top-0 h-full opacity-80">
        <div className={`absolute left-[12%] top-[18%] h-1 w-[58%] rounded-full ${mergedTheme.line}`} />
        <div className={`absolute left-[12%] top-[38%] h-1 w-[72%] rounded-full ${mergedTheme.line}`} />
        <div className={`absolute left-[12%] top-[58%] h-1 w-[52%] rounded-full ${mergedTheme.line}`} />
        <div className={`absolute right-[14%] top-[16%] h-12 w-12 rounded-full blur-sm ${mergedTheme.line}`} />
      </div>
      <div className={`relative inline-flex items-center gap-2 rounded-2xl ${mergedTheme.panel} ${compact ? 'px-3 py-2' : 'px-4 py-3'} shadow-sm`}>
        <span className={`inline-flex items-center justify-center rounded-2xl ${mergedTheme.iconWrap} ${compact ? 'h-10 w-10' : 'h-12 w-12'}`}>
          <Icon className={`${mergedTheme.iconColor} ${compact ? 'h-5 w-5' : 'h-6 w-6'}`} strokeWidth={2.25} />
        </span>
        <span className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">{label}</span>
      </div>
      <div className={`relative ${compact ? 'mt-6' : 'mt-8'} flex items-end justify-between`}>
        <div className="grid gap-3">
          <div className={`rounded-[1.5rem] ${mergedTheme.panel} ${compact ? 'h-24 w-20' : 'h-28 w-24'} shadow-sm`} />
          <div className={`rounded-[1.5rem] ${mergedTheme.panel} ${compact ? 'h-16 w-20' : 'h-20 w-24'} shadow-sm`} />
        </div>
        <div className="grid gap-3">
          <div className={`rounded-[1.5rem] ${mergedTheme.panel} ${compact ? 'h-16 w-20' : 'h-20 w-24'} shadow-sm`} />
          <div className={`rounded-[1.5rem] ${mergedTheme.panel} ${compact ? 'h-28 w-20' : 'h-32 w-24'} shadow-sm`} />
        </div>
        <div className={`absolute bottom-2 left-0 right-0 h-2 rounded-full ${mergedTheme.line}`} />
        <div className="absolute bottom-1 left-[14%] flex gap-16">
          <span className={`h-3 w-3 rounded-full ${mergedTheme.dot}`} />
          <span className={`h-3 w-3 rounded-full ${mergedTheme.dot}`} />
          <span className={`h-3 w-3 rounded-full ${mergedTheme.dot}`} />
        </div>
      </div>
    </div>
  );
}

export function MiniFeatureGrid() {
  const items = [
    {icon: Workflow, label: 'Workflow'},
    {icon: CircuitBoard, label: 'Engineering'},
    {icon: Boxes, label: 'Production'},
    {icon: Truck, label: 'Delivery'}
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map((item, index) => (
        <div key={item.label} className={`rounded-[1.75rem] p-5 ${index === 0 ? 'bg-primary text-white' : 'bg-surface-container-low shadow-panel'}`}>
          <item.icon className={`h-7 w-7 ${index === 0 ? 'text-white' : 'text-primary'}`} strokeWidth={2.25} />
          <p className={`mt-6 font-headline text-lg font-bold ${index === 0 ? 'text-white' : 'text-primary'}`}>{item.label}</p>
        </div>
      ))}
    </div>
  );
}

const productVisualMap: Record<
  string,
  {
    icon: LucideIcon;
    label: string;
    theme: Partial<VisualTheme>;
  }
> = {
  'interlocking-learning-set': {
    icon: Blocks,
    label: 'Toy Program',
    theme: {
      shell: 'bg-gradient-to-br from-amber-50 via-orange-50 to-slate-100',
      panel: 'bg-white/88',
      iconWrap: 'bg-amber-100',
      iconColor: 'text-amber-700',
      line: 'bg-amber-200/80',
      dot: 'bg-amber-700'
    }
  },
  'pretend-play-kit': {
    icon: Bot,
    label: 'Smart Parts',
    theme: {
      shell: 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100',
      panel: 'bg-white/84',
      iconWrap: 'bg-indigo-100',
      iconColor: 'text-indigo-700',
      line: 'bg-indigo-200/80',
      dot: 'bg-indigo-600'
    }
  },
  'pu-pvc-profile-series': {
    icon: Layers3,
    label: 'Extrusion',
    theme: {
      shell: 'bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100',
      panel: 'bg-white/82',
      iconWrap: 'bg-blue-100',
      iconColor: 'text-blue-700',
      line: 'bg-blue-200/80',
      dot: 'bg-blue-600'
    }
  },
  'extrusion-support-line': {
    icon: Wrench,
    label: 'Equipment',
    theme: {
      shell: 'bg-gradient-to-br from-slate-100 via-slate-50 to-indigo-50',
      panel: 'bg-slate-900/90',
      iconWrap: 'bg-white/12',
      iconColor: 'text-white',
      line: 'bg-slate-300/50',
      dot: 'bg-amber-500'
    }
  },
  'custom-injection-extrusion-solutions': {
    icon: CircuitBoard,
    label: 'Injection',
    theme: {
      shell: 'bg-gradient-to-br from-slate-50 via-slate-100 to-zinc-100',
      panel: 'bg-white/86',
      iconWrap: 'bg-slate-200',
      iconColor: 'text-slate-900',
      line: 'bg-slate-300/80',
      dot: 'bg-slate-700'
    }
  }
};

export function ProductVisual({slug, label, compact = false}: {slug: string; label: string; compact?: boolean}) {
  const item = productVisualMap[slug] ?? {
    icon: Package,
    label: 'Manufacturing',
    theme: baseTheme
  };

  return <VisualCard compact={compact} icon={item.icon} label={label || item.label} theme={item.theme} />;
}

export const iconSets = {
  companyHero: [
    {icon: Factory, label: 'Source Factory'},
    {icon: Workflow, label: 'Closed Loop'},
    {icon: Globe2, label: 'Global Delivery'}
  ],
  factoryHero: [
    {icon: Factory, label: 'Production'},
    {icon: Cog, label: 'Equipment'},
    {icon: Truck, label: 'Export'}
  ],
  oemHero: [
    {icon: ClipboardList, label: 'Review'},
    {icon: Wrench, label: 'Tooling'},
    {icon: Package, label: 'Launch'}
  ],
  complianceHero: [
    {icon: FileText, label: 'Documents'},
    {icon: BadgeCheck, label: 'Quality'},
    {icon: ShieldCheck, label: 'Review'}
  ],
  departmentShowcase: [
    {icon: Factory, label: 'Equipment'},
    {icon: Boxes, label: 'Products'},
    {icon: Users, label: 'Assembly'},
    {icon: Globe2, label: 'Trade'}
  ]
};
