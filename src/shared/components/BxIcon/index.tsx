import React from "react";
import {
  Pencil,
  Settings,
  Trash,
  X,
  Plus,
  Moon,
  Sun,
  Tag,
  Folder,
  File,
  Hash,
  Smartphone,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Ellipsis,
  Check,
  Copy,
  Edit,
  ExternalLink,
  Eye,
  EyeOff,
  LogOut,
  Lock,
  Key,
  Shield,
  Fingerprint,
  ScanFace,
  CheckCircle,
  BadgeCheck,
  CircleX,
  CircleAlert,
  Info,
} from "lucide-react-native";

// ─── Name union ───────────────────────────────────────────────────────────────

export type BxIconName =
  | "bx-chevron-left"
  | "bx-chevron-right"
  | "bx-chevron-down"
  | "bx-chevron-up"
  | "bx-x"
  | "bx-plus"
  | "bx-check"
  | "bx-dots-horizontal-rounded"
  | "bx-edit"
  | "bx-trash"
  | "bx-copy"
  | "bx-link-external"
  | "bx-show"
  | "bx-hide"
  | "bx-log-out"
  | "bx-lock-alt"
  | "bx-key"
  | "bx-shield"
  | "bx-fingerprint"
  | "bxs-face"
  | "bx-check-circle"
  | "bxs-check-circle"
  | "bx-error-circle"
  | "bx-alert"
  | "bx-info-circle"
  | "bx-cog"
  | "bx-moon"
  | "bx-sun"
  | "bx-tag"
  | "bx-folder"
  | "bx-file-blank"
  | "bx-hash"
  | "bx-smartphone"
  | "bx-trash-alt"
  | "pencil";

// ─── Props ────────────────────────────────────────────────────────────────────

interface BxIconProps {
  name: BxIconName;
  size?: number;
  color?: string;
}

export const BxIcon = ({
  name,
  size = 24,
  color = "currentColor",
}: BxIconProps) => {
  switch (name) {
    case "pencil":
      return <Pencil color={color} size={size} />;
    case "bx-cog":
      return <Settings color={color} size={size} />;
    case "bx-chevron-left":
      return <ChevronLeft color={color} size={size} />;
    case "bx-chevron-right":
      return <ChevronRight color={color} size={size} />;
    case "bx-chevron-down":
      return <ChevronDown color={color} size={size} />;
    case "bx-chevron-up":
      return <ChevronUp color={color} size={size} />;
    case "bx-x":
      return <X color={color} size={size} />;
    case "bx-plus":
      return <Plus color={color} size={size} />;
    case "bx-check":
      return <Check color={color} size={size} />;
    case "bx-dots-horizontal-rounded":
      return <Ellipsis color={color} size={size} />;
    case "bx-edit":
      return <Edit color={color} size={size} />;
    case "bx-trash":
      return <Trash color={color} size={size} />;
    case "bx-copy":
      return <Copy color={color} size={size} />;
    case "bx-link-external":
      return <ExternalLink color={color} size={size} />;
    case "bx-show":
      return <Eye color={color} size={size} />;
    case "bx-hide":
      return <EyeOff color={color} size={size} />;
    case "bx-log-out":
      return <LogOut color={color} size={size} />;
    case "bx-lock-alt":
      return <Lock color={color} size={size} />;
    case "bx-key":
      return <Key color={color} size={size} />;
    case "bx-shield":
      return <Shield color={color} size={size} />;
    case "bx-fingerprint":
      return <Fingerprint color={color} size={size} />;
    case "bxs-face":
      return <ScanFace color={color} size={size} />;
    case "bx-check-circle":
      return <CheckCircle color={color} size={size} />;
    case "bxs-check-circle":
      return <BadgeCheck color={color} size={size} />;
    case "bx-error-circle":
      return <CircleX color={color} size={size} />;
    case "bx-alert":
      return <CircleAlert color={color} size={size} />;
    case "bx-info-circle":
      return <Info color={color} size={size} />;
    case "bx-moon":
      return <Moon color={color} size={size} />;
    case "bx-sun":
      return <Sun color={color} size={size} />;
    case "bx-tag":
      return <Tag color={color} size={size} />;
    case "bx-folder":
      return <Folder color={color} size={size} />;
    case "bx-file-blank":
      return <File color={color} size={size} />;
    case "bx-hash":
      return <Hash color={color} size={size} />;
    case "bx-smartphone":
      return <Smartphone color={color} size={size} />;
    case "bx-trash-alt":
      return <Trash color={color} size={size} />;
    default:
      return null;
  }
};
