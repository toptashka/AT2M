import { Select, Field, Popover } from "./WorkspaceUI";
import WorkspaceCalendar from "./WorkspaceCalendar";
import { INITIAL_FILTERS, selection } from "./workspaceModel";

export function ProductFilter({ value, onChange, products = [] }) {
  return (
    <Select
      multiple
      allMeansEmpty
      menuTitle="ИТ-продукты"
      label="Все продукты"
      allLabel="Все продукты"
      searchPlaceholder="Поиск продуктов"
      value={selection(value)}
      options={products}
      onChange={onChange}
    />
  );
}

export function PeriodFilter({ value, onChange }) {
  const format = (date) => date.split("-").reverse().join(".");

  return (
    <Popover
      label="Период"
      width={808}
      panelClassName="at-calendar-popup"
      summary={value.start && value.end ? format(value.start) + " — " + format(value.end) : "Период"}
    >
      {(close) => (
        <WorkspaceCalendar
          from={value.start}
          to={value.end}
          onReset={() => onChange({ start: "", end: "" })}
          onApply={(range) => {
            onChange({ start: range.from, end: range.to });
            close();
          }}
        />
      )}
    </Popover>
  );
}

export default function WorkspaceFilters({ value, onChange, interactions = [], managers = [], catalogs = { programs: [], universities: [], regions: [] } }) {
  const change = (key, next) => onChange({ ...value, [key]: next });

  const list = Array.isArray(interactions) ? interactions : [];

  const institutions = [...new Set([...(catalogs.universities || []), ...list.map((item) => item.name)].filter(Boolean))];
  const cities = [...new Set([...(catalogs.regions || []), ...list.map((item) => item.city)].filter(Boolean))];
  const dynamicPrograms = [...new Set([...(catalogs.programs || []).map((p) => p.direction), ...list.map((item) => item.direction)].filter((name) => name && name !== "ИТ-направление"))];
  const dynamicProducts = [...new Set([...(catalogs.programs || []).map((p) => p.software), ...list.map((item) => item.product)].filter(Boolean))];
  
  const dynamicOwners = managers.length > 0 ? managers : [...new Set(list.map((item) => item.owner).filter(Boolean))];

  return (
    <div className="aw-toolbar">
      <input
        className="at-input"
        placeholder="Найти учреждение, программу или ИТ-продукт…"
        aria-label="Поиск взаимодействий"
        value={value.search || ""}
        onChange={(event) => change("search", event.target.value)}
      />
      <Select
        multiple
        allMeansEmpty
        value={selection(value.direction)}
        label="ИТ-направление"
        allLabel="Все направления"
        searchPlaceholder="Поиск направлений"
        options={dynamicPrograms}
        onChange={(next) => change("direction", next)}
      />
      <ProductFilter
        value={value.products}
        onChange={(next) => change("products", next)}
        products={dynamicProducts}
      />
      <Select
        multiple
        allMeansEmpty
        value={selection(value.status)}
        label="Статус"
        allLabel="Все статусы"
        searchPlaceholder="Поиск статусов"
        options={["В работе", "Требует внимания", "Просрочено", "Завершено"]}
        onChange={(next) => change("status", next)}
      />
      <Select
        multiple
        allMeansEmpty
        value={selection(value.owner)}
        label="Ответственный КАМ"
        allLabel="Все ответственные"
        searchPlaceholder="Поиск сотрудников"
        options={dynamicOwners}
        onChange={(next) => change("owner", next)}
      />
      <PeriodFilter
        value={{ start: value.start, end: value.end }}
        onChange={(next) => onChange({ ...value, ...next })}
      />
      <Popover label="Ещё фильтры" width={304} panelClassName="at-extra-popup">
        {(close) => (
          <div className="at-extra-content">
            <Select
              multiple
              allMeansEmpty
              value={selection(value.institution)}
              label="Учреждение"
              allLabel="Все учреждения"
              searchPlaceholder="Поиск учреждений"
              options={institutions}
              onChange={(next) => change("institution", next)}
            />
            <Select
              multiple
              allMeansEmpty
              value={selection(value.city)}
              label="Город"
              allLabel="Все города"
              searchPlaceholder="Поиск городов"
              options={cities}
              onChange={(next) => change("city", next)}
            />
            <Field label="Дата изменения">
              <input
                className="at-input"
                type="date"
                value={value.changed || ""}
                onChange={(event) => change("changed", event.target.value)}
              />
            </Field>
            <button
              type="button"
              onClick={() => {
                onChange(INITIAL_FILTERS);
                close();
              }}
            >
              Сбросить фильтры
            </button>
          </div>
        )}
      </Popover>
    </div>
  );
}