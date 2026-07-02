"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { DataGridProps } from "@mui/x-data-grid";
import GuideNav from "@/components/guide/GuideNav";
import { pageIndexRows } from "@/data/pageIndex";
import { pageIndexColumns, type PageIndexTableRow } from "./pageIndexTable.columns";

const DataGrid = dynamic(
  () => import("@mui/x-data-grid").then((mod) => mod.DataGrid),
  { ssr: false },
) as ComponentType<DataGridProps<PageIndexTableRow>>;

const pageIndexTableRows: PageIndexTableRow[] = pageIndexRows.map((row, index) => ({
  ...row,
  no: index + 1,
}));

export default function PageIndexTable() {
  return (
    <section className="page-index">
      <GuideNav current="index" />
      <header className="page-index__header">
        <h1>페이지 인덱스</h1>
        <p>프로젝트 페이지·가이드 목록과 작업 상태입니다.</p>
      </header>
      <div className="page-index__grid">
        <DataGrid
          rows={pageIndexTableRows}
          columns={pageIndexColumns}
          getRowId={(row: PageIndexTableRow) => row.id}
          disableRowSelectionOnClick
          pageSizeOptions={[pageIndexTableRows.length]}
          initialState={{
            pagination: { paginationModel: { pageSize: pageIndexTableRows.length } },
          }}
          getRowHeight={() => "auto"}
          sx={{
            "& .MuiDataGrid-cell": {
              alignItems: "flex-start",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontSize: 13,
            },
          }}
          autoHeight
        />
      </div>
    </section>
  );
}
