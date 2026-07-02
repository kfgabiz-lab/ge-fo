import Link from "next/link";
import { Chip } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { getBreadcrumbTrail } from "@/data/breadcrumbConfig";
import type { PageIndexRow, PageStatus } from "@/data/pageIndex";

const statusColor: Record<
  PageStatus,
  "success" | "warning" | "info" | "default"
> = {
  완료: "success",
  수정: "warning",
  진행: "info",
  보류중: "default",
};

function getUrlDepthLabel(link: string, depthIndex: number): string {
  const pathname = link.split("?")[0].split("#")[0];
  const segments = pathname.split("/").filter(Boolean);
  return segments[depthIndex] ?? "-";
}

function getDepthLabel(link: string, depthIndex: number): string {
  const pathname = link.split("?")[0].split("#")[0];
  const trail = getBreadcrumbTrail(pathname);
  if (trail.length > 0) {
    return trail[depthIndex] ?? "-";
  }
  return getUrlDepthLabel(link, depthIndex);
}

export type PageIndexTableRow = PageIndexRow & { no: number };

export const pageIndexColumns: GridColDef<PageIndexTableRow>[] = [
  {
    field: "no",
    headerName: "No.",
    width: 72,
    align: "center",
    headerAlign: "center",
    sortable: false,
  },
  {
    field: "pageId",
    headerName: "Page ID",
    flex: 1,
    minWidth: 120,
  },
  {
    field: "link",
    headerName: "URL",
    flex: 1.2,
    minWidth: 160,
    renderCell: ({ value }) => (
      <Link href={String(value)} className="page-index__link">
        {String(value)}
      </Link>
    ),
  },
  {
    field: "depth1",
    headerName: "1뎁스",
    width: 120,
    align: "center",
    headerAlign: "center",
    renderCell: ({ row }) => getDepthLabel(row.link, 0),
    sortable: false,
  },
  {
    field: "depth2",
    headerName: "2뎁스",
    width: 140,
    align: "center",
    headerAlign: "center",
    renderCell: ({ row }) => getDepthLabel(row.link, 1),
    sortable: false,
  },
  {
    field: "depth3",
    headerName: "3뎁스",
    width: 160,
    align: "center",
    headerAlign: "center",
    renderCell: ({ row }) => getDepthLabel(row.link, 2),
    sortable: false,
  },
  {
    field: "date",
    headerName: "날짜",
    width: 120,
    renderCell: ({ row }) => (row.status === "완료" ? row.date ?? "" : ""),
  },
  {
    field: "status",
    headerName: "상태",
    width: 100,
    align: "center",
    headerAlign: "center",
    renderCell: ({ value }) => (
      <Chip
        label={String(value)}
        color={statusColor[value as PageStatus]}
        size="small"
        variant="outlined"
      />
    ),
  },
  {
    field: "note",
    headerName: "비고",
    flex: 1.5,
    minWidth: 260,
    renderCell: ({ value }) => (
      <div
        style={{
          whiteSpace: "normal",
          wordBreak: "break-word",
          lineHeight: 1.35,
          fontSize: 12,
          padding: "6px 0",
        }}
      >
        {String(value)}
      </div>
    ),
  },
];
