import { useState } from "react";
import { Trash2, Plus, X, Car } from "lucide-react";
import type { FinanceConfig, CarsharingService, CarsharingTag } from "../types";
import { formatRub } from "../lib/calc";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface Props {
  config: FinanceConfig;
  onAddTrip: (trip: {
    date: string;
    amount: number;
    service: CarsharingService;
    tagIds: string[];
    comment?: string;
  }) => void;
  onDeleteTrip: (id: string) => void;
  onAddTag: (name: string) => void;
  onDeleteTag: (id: string) => void;
}

const MONTHS = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

const selectCls =
  "flex-1 h-10 rounded-lg border border-input bg-transparent px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 appearance-none";

function DateSelects({
  date,
  onChange,
}: {
  date: string;
  onChange: (d: string) => void;
}) {
  const [y, m, d] = date.split("-").map(Number);
  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1];
  const daysInMonth = new Date(y, m, 0).getDate();

  const set = (newY: number, newM: number, newD: number) => {
    const clampedD = Math.min(newD, new Date(newY, newM, 0).getDate());
    onChange(
      `${newY}-${String(newM).padStart(2, "0")}-${String(clampedD).padStart(2, "0")}`,
    );
  };

  return (
    <div className="flex gap-2">
      <select
        value={d}
        onChange={(e) => set(y, m, Number(e.target.value))}
        className={selectCls}
      >
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
          <option key={day} value={day}>
            {day}
          </option>
        ))}
      </select>
      <select
        value={m}
        onChange={(e) => set(y, Number(e.target.value), d)}
        className={`${selectCls} flex-[2]`}
      >
        {MONTHS.map((name, i) => (
          <option key={i} value={i + 1}>
            {name}
          </option>
        ))}
      </select>
      <select
        value={y}
        onChange={(e) => set(Number(e.target.value), m, d)}
        className={selectCls}
      >
        {years.map((yr) => (
          <option key={yr} value={yr}>
            {yr}
          </option>
        ))}
      </select>
    </div>
  );
}

function today() {
  return new Date().toISOString().split("T")[0];
}

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
  });
}

function ServiceBadge({ service }: { service: CarsharingService }) {
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
        service === "yandex"
          ? "bg-amber-100 text-amber-800"
          : "bg-blue-100 text-blue-700"
      }`}
    >
      {service === "yandex" ? "Я.Драйв" : "Ситидрайв"}
    </span>
  );
}

function AddTripForm({
  tags,
  onAdd,
  onAddTag,
}: {
  tags: CarsharingTag[];
  onAdd: Props["onAddTrip"];
  onAddTag: (name: string) => void;
}) {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(today());
  const [service, setService] = useState<CarsharingService>("yandex");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [newTagInput, setNewTagInput] = useState("");
  const [showTagInput, setShowTagInput] = useState(false);

  const toggleTag = (id: string) =>
    setSelectedTag((prev) => (prev === id ? null : id));

  const submitTag = () => {
    const name = newTagInput.trim();
    if (name) onAddTag(name);
    setNewTagInput("");
    setShowTagInput(false);
  };

  const submit = () => {
    const n = parseFloat(amount);
    if (!n || n <= 0) return;
    onAdd({
      date,
      amount: n,
      service,
      tagIds: selectedTag ? [selectedTag] : [],
      comment: comment.trim() || undefined,
    });
    setAmount("");
    setDate(today());
    setSelectedTag(null);
    setComment("");
  };

  const canSubmit = parseFloat(amount) > 0 && selectedTag !== null;

  return (
    <Card className="rounded-2xl border-stone-200">
      <CardContent className="p-4 space-y-3.5">
        {/* Amount */}
        <Input
          inputMode="numeric"
          placeholder="Сумма, ₽"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && canSubmit && submit()}
          className="text-xl font-bold h-12"
        />

        {/* Date — 3 selects */}
        <DateSelects date={date} onChange={setDate} />

        {/* Service */}
        <div className="flex gap-2">
          <button
            onClick={() => setService("yandex")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              service === "yandex"
                ? "bg-amber-400 text-amber-950 shadow-sm"
                : "bg-stone-100 text-stone-400"
            }`}
          >
            Яндекс.Драйв
          </button>
          <button
            onClick={() => setService("citydrive")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              service === "citydrive"
                ? "bg-blue-500 text-white shadow-sm"
                : "bg-stone-100 text-stone-400"
            }`}
          >
            Ситидрайв
          </button>
        </div>

        {/* Tags */}
        <div>
          <div className="text-xs text-muted-foreground mb-2">Маршрут <span className="text-red-400">*</span></div>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedTag === tag.id
                    ? "bg-[#111827] text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {tag.name}
              </button>
            ))}
            {showTagInput ? (
              <div className="flex items-center gap-1.5">
                <Input
                  autoFocus
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") submitTag();
                    if (e.key === "Escape") setShowTagInput(false);
                  }}
                  placeholder="Название маршрута"
                  className="h-7 text-xs w-36 px-2"
                />
                <button
                  onClick={submitTag}
                  className="text-xs text-emerald-600 font-semibold"
                >
                  OK
                </button>
                <button
                  onClick={() => setShowTagInput(false)}
                  className="text-stone-400 hover:text-stone-600"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowTagInput(true)}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-stone-100 text-stone-400 hover:bg-stone-200 flex items-center gap-1 transition-colors"
              >
                <Plus size={12} /> маршрут
              </button>
            )}
          </div>
        </div>

        {/* Comment */}
        <Input
          placeholder="Комментарий (необязательно)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="text-sm"
        />

        <Button onClick={submit} className="w-full h-11" disabled={!canSubmit}>
          Добавить поездку
        </Button>
      </CardContent>
    </Card>
  );
}

function StatsCard({ config }: { config: FinanceConfig }) {
  const { carsharingTrips: trips, carsharingTags: tags } = config;
  if (!trips.length) return null;

  const total = trips.reduce((s, t) => s + t.amount, 0);
  const avg = Math.round(total / trips.length);

  const byService = {
    yandex: { count: 0, total: 0 },
    citydrive: { count: 0, total: 0 },
  };
  trips.forEach((t) => {
    byService[t.service].count++;
    byService[t.service].total += t.amount;
  });

  const tagStats = tags
    .map((tag) => {
      const tagTrips = trips.filter((t) => t.tagIds.includes(tag.id));
      if (!tagTrips.length) return null;
      const tagTotal = tagTrips.reduce((s, t) => s + t.amount, 0);
      return {
        ...tag,
        count: tagTrips.length,
        total: tagTotal,
        avg: Math.round(tagTotal / tagTrips.length),
      };
    })
    .filter(Boolean) as {
    id: string;
    name: string;
    count: number;
    total: number;
    avg: number;
  }[];

  return (
    <Card className="rounded-2xl border-stone-200 overflow-hidden">
      {/* Hero */}
      <div className="bg-[#111827] text-white px-4 py-4 flex justify-between items-end">
        <div>
          <div className="text-[10px] tracking-widest text-white/30 uppercase mb-1">
            Всего потрачено
          </div>
          <div className="text-2xl font-bold">{formatRub(total)}</div>
          <div className="text-xs text-white/40 mt-0.5">
            {trips.length} поездок · avg {formatRub(avg)}
          </div>
        </div>
        <Car size={32} className="text-white/10" />
      </div>

      <CardContent className="p-4 space-y-3">
        {/* By service */}
        <div className="grid grid-cols-2 gap-2">
          {(["yandex", "citydrive"] as const).map((s) => {
            const d = byService[s];
            if (!d.count) return null;
            return (
              <div
                key={s}
                className={`rounded-xl p-3 ${s === "yandex" ? "bg-amber-50" : "bg-blue-50"}`}
              >
                <div
                  className={`text-xs font-semibold mb-1 ${s === "yandex" ? "text-amber-700" : "text-blue-700"}`}
                >
                  {s === "yandex" ? "Яндекс.Драйв" : "Ситидрайв"}
                </div>
                <div className="text-sm font-bold text-stone-800">
                  {formatRub(d.total)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {d.count} поездок
                </div>
              </div>
            );
          })}
        </div>

        {/* By tag */}
        {tagStats.length > 0 && (
          <div className="space-y-2 pt-1 border-t border-stone-100">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              По маршрутам
            </div>
            {tagStats.map((t) => (
              <div key={t.id} className="flex items-center gap-2">
                <span className="text-xs text-stone-700 flex-1 truncate">
                  {t.name}
                </span>
                <span className="text-xs text-muted-foreground shrink-0">
                  {t.count} × avg {formatRub(t.avg)}
                </span>
                <span className="text-xs font-bold text-stone-800 shrink-0 w-16 text-right">
                  {formatRub(t.total)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function Carsharing({
  config,
  onAddTrip,
  onDeleteTrip,
  onAddTag,
}: Props) {
  const sorted = [...config.carsharingTrips].sort((a, b) =>
    b.date.localeCompare(a.date),
  );

  return (
    <div className="space-y-4">
      <AddTripForm
        tags={config.carsharingTags}
        onAdd={onAddTrip}
        onAddTag={onAddTag}
      />
      <StatsCard config={config} />

      {sorted.length > 0 && (
        <Card className="rounded-2xl border-stone-200">
          <CardContent className="p-0">
            <div className="px-4 py-3 border-b border-stone-100 flex items-center justify-between">
              <div className="text-sm font-semibold">История</div>
              <div className="text-xs text-muted-foreground">
                {sorted.length} поездок
              </div>
            </div>
            {sorted.map((trip, i) => {
              const tripTags = config.carsharingTags.filter((t) =>
                trip.tagIds.includes(t.id),
              );
              return (
                <div
                  key={trip.id}
                  className={`flex items-center px-4 py-3.5 gap-3 ${i < sorted.length - 1 ? "border-b border-stone-100" : ""}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-xs font-medium text-stone-700">
                        {formatDate(trip.date)}
                      </span>
                      <ServiceBadge service={trip.service} />
                    </div>
                    {tripTags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {tripTags.map((t) => (
                          <span
                            key={t.id}
                            className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full"
                          >
                            {t.name}
                          </span>
                        ))}
                      </div>
                    )}
                    {trip.comment && (
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {trip.comment}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-base font-bold">
                      {formatRub(trip.amount)}
                    </span>
                    <button
                      onClick={() => onDeleteTrip(trip.id)}
                      className="text-stone-300 hover:text-red-400 transition-colors p-1 -mr-1"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {!sorted.length && (
        <div className="text-center py-12">
          <Car size={36} className="mx-auto text-stone-300 mb-3" />
          <div className="text-sm text-muted-foreground">Поездок пока нет</div>
          <div className="text-xs text-stone-400 mt-1">Добавь первую выше</div>
        </div>
      )}
    </div>
  );
}
