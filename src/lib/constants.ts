export const FIT_LABELS: Record<string, string> = {
  yes: "Yes",
  no: "No",
  maybe: "Maybe",
  unclassified: "Unclassified",
};

export const FIT_COLORS: Record<string, string> = {
  yes: "bg-blue-100 text-blue-800",
  no: "bg-red-100 text-red-800",
  maybe: "bg-yellow-100 text-yellow-800",
  unclassified: "bg-gray-100 text-gray-600",
};

export const STATUS_LABELS: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  interested: "Interested",
  not_interested: "Not Interested",
  converted: "Converted",
  ignored: "Ignored",
};

export const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-purple-100 text-purple-800",
  interested: "bg-blue-100 text-blue-800",
  not_interested: "bg-red-100 text-red-800",
  converted: "bg-blue-100 text-blue-800",
  ignored: "bg-gray-100 text-gray-500",
};

export const RUN_STATUS_COLORS: Record<string, string> = {
  queued: "bg-gray-100 text-gray-600",
  running: "bg-blue-100 text-blue-800",
  completed: "bg-blue-100 text-blue-800",
  failed: "bg-red-100 text-red-800",
};

export const REMOTE_FLAG_LABELS: Record<string, string> = {
  remote: "Remote",
  hybrid: "Hybrid",
  onsite: "Onsite",
  unknown: "Unknown",
};

export const ROLE_TYPE_LABELS: Record<string, string> = {
  admin: "Admin / EA",
  customer_support: "Customer Support",
  sales_support: "Sales Support",
  marketing_ops: "Marketing Ops",
  bookkeeping_assist: "Bookkeeping",
  operations: "Operations",
  other: "Other",
};
