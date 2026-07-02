import { Fragment, type ReactNode } from "react";
import type {
  ProductFrameLineup,
  ProductLineupRow,
  ProductLineupTypeCell,
  ProductLineupVariant,
} from "../../data/productDetailContent";

type DevicesProductLineupProps = {
  items?: ProductLineupRow[];
  frameLineup?: ProductFrameLineup;
  /** @default "type1" — 가이드: type1(MCCB) · type2(VFD frame) */
  variant?: ProductLineupVariant;
  configuratorHref?: string;
  configuratorExternal?: boolean;
};

type LineupGridModifier = "type1" | "type2";

type LineupTableColumn = {
  id: string;
  header: ReactNode;
  colClass?: string;
};

type LineupTableRow = {
  key: string;
  rowClass?: string;
  rowHeader: ReactNode;
  cells: ReactNode[];
};

type LineupTableModel = {
  modifier: LineupGridModifier;
  cornerHeader: string;
  columns: LineupTableColumn[];
  rows: LineupTableRow[];
  rowHeaderColClass:
    | "devices_product_lineup__col--type"
    | "devices_product_lineup__col--label";
  rowHeaderCellClass:
    | "devices_product_lineup__type-cell"
    | "devices_product_lineup__label-cell";
};

const FOOTER_NOTE = [
  "Explore all available configurations effortlessly.",
  "Our Configurator helps you select the right specifications in just a few clicks.",
] as const;

const MCCB_COLUMNS: LineupTableColumn[] = [
  { id: "rated-current", header: "Rated Current", colClass: "devices_product_lineup__col--data" },
  {
    id: "interrupting",
    header: "Interrupting Capacity (at 480 Vac)",
    colClass: "devices_product_lineup__col--data",
  },
  { id: "standard", header: "Standard", colClass: "devices_product_lineup__col--data" },
];

function LineupInterrupting({ values }: { values: string[] }) {
  return (
    <div className="devices_product_lineup__cell-values">
      {values.map((value, index) => (
        <Fragment key={value}>
          {index > 0 ? (
            <span className="devices_product_lineup__cell-sep" aria-hidden="true" />
          ) : null}
          <span>{value}</span>
        </Fragment>
      ))}
    </div>
  );
}

function LineupTypeHeader({ type }: { type: ProductLineupTypeCell }) {
  return (
    <div className="devices_product_lineup__type-inner">
      <div className="devices_product_lineup__type-img">
        <img loading="lazy" decoding="async" src={type.image} alt="" />
      </div>
      <p className="devices_product_lineup__type-label">{type.label}</p>
    </div>
  );
}

function LineupTableGrid({
  modifier,
  cornerHeader,
  columns,
  rows,
  rowHeaderColClass,
  rowHeaderCellClass,
}: LineupTableModel) {
  return (
    <div className={`devices_product_lineup__grid devices_product_lineup__grid--${modifier}`}>
      <div className="devices_product_lineup__grid-scroll">
        <table className="devices_product_lineup__table">
          <colgroup>
            <col className={rowHeaderColClass} />
            {columns.map((column) => (
              <col
                key={column.id}
                className={column.colClass ?? "devices_product_lineup__col--data"}
              />
            ))}
          </colgroup>
          <thead>
            <tr>
              <th scope="col" className="devices_product_lineup__head-cell">
                {cornerHeader}
              </th>
              {columns.map((column) => (
                <th key={column.id} scope="col" className="devices_product_lineup__head-cell">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.key}
                className={
                  row.rowClass
                    ? `devices_product_lineup__row ${row.rowClass}`
                    : "devices_product_lineup__row"
                }
              >
                <th scope="row" className={rowHeaderCellClass}>
                  {row.rowHeader}
                </th>
                {row.cells.map((cell, cellIndex) => (
                  <td key={`${row.key}-${cellIndex}`} className="devices_product_lineup__cell">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function buildMccbTable(items: ProductLineupRow[]): LineupTableModel {
  return {
    modifier: "type1",
    cornerHeader: "Type",
    columns: MCCB_COLUMNS,
    rowHeaderColClass: "devices_product_lineup__col--type",
    rowHeaderCellClass: "devices_product_lineup__type-cell",
    rows: items.map((row) => ({
      key: row.type.label,
      rowClass: row.tall ? "devices_product_lineup__row--tall" : undefined,
      rowHeader: <LineupTypeHeader type={row.type} />,
      cells: [
        row.ratedCurrent,
        <LineupInterrupting key="interrupting" values={row.interrupting} />,
        row.standard,
      ],
    })),
  };
}

function buildFrameTable(lineup: ProductFrameLineup): LineupTableModel {
  return {
    modifier: "type2",
    cornerHeader: "Frame",
    columns: lineup.columns.map((column) => ({
      id: column,
      header: column,
      colClass: "devices_product_lineup__col--data",
    })),
    rowHeaderColClass: "devices_product_lineup__col--label",
    rowHeaderCellClass: "devices_product_lineup__label-cell",
    rows: lineup.rows.map((row) => ({
      key: row.label,
      rowClass: "devices_product_lineup__row--type2",
      rowHeader: row.label,
      cells: row.values,
    })),
  };
}

function resolveLineupTable(
  variant: ProductLineupVariant,
  items: ProductLineupRow[],
  frameLineup?: ProductFrameLineup,
): LineupTableModel | null {
  if (variant === "type2" && frameLineup) {
    return buildFrameTable(frameLineup);
  }

  if (variant === "type1" && items.length > 0) {
    return buildMccbTable(items);
  }

  return null;
}

export default function DevicesProductLineup({
  items = [],
  frameLineup,
  variant = "type1",
  configuratorHref = "",
  configuratorExternal = false,
}: DevicesProductLineupProps) {
  const configuratorProps = configuratorExternal
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};
  const table = resolveLineupTable(variant, items, frameLineup);

  return (
    <section className="devices_product_lineup" id="product-lineup">
      <div className="inner">
        <h2 className="section_tit">Lineup</h2>
        {table ? <LineupTableGrid {...table} /> : null}
        <div className="devices_product_lineup__footer">
          <div className="devices_product_lineup__note">
            {FOOTER_NOTE.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <a
            href={configuratorHref}
            className="btn-base btn-lv02 btn-lv02--solid"
            {...configuratorProps}
          >
            Go to Configurator
            <span className="icon_link-14" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
