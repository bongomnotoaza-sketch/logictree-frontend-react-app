export interface EventsCardData {
  event: string;
  description: string;
datetoevent: string;
}

const eventCards: EventsCardData[] = [
  {
    event: "Annual Tech Summit",
    description: "A gathering of industry leaders discussing the latest innovations in technology.",
    datetoevent: "2026-10-15",
  },
  {
    event: "Charity Fun Run",
    description: "A 5K run to raise funds for local children's hospitals.",
    datetoevent: "2026-09-20",
  },
  {
    event: "Product Launch Party",
    description: "Celebrating the release of our newest flagship product with live demos.",
    datetoevent: "2026-11-02",
  },
  {
    event: "Music Festival",
    description: "A weekend of live performances featuring artists from around the world.",
    datetoevent: "2026-12-05",
  },
  {
    event: "Startup Pitch Night",
    description: "Early-stage founders pitch their ideas to a panel of investors.",
    datetoevent: "2026-09-28",
  },
  {
    event: "Community Food Drive",
    description: "Volunteers collect and distribute food donations to families in need.",
    datetoevent: "2026-10-08",
  },
  {
    event: "Winter Art Exhibition",
    description: "A showcase of contemporary art from local and international artists.",
    datetoevent: "2026-12-18",
  },
];

export default eventCards;