import pool from '../src/db.js';

const sampleTickets = [
  {
    title: 'Employee cannot access payroll portal',
    description: 'A finance employee receives a 403 error after signing in to the payroll portal from Chrome.',
    contact_info: 'it-support@company.com',
    status: 'pending',
    created_at: '2026-04-02T08:30:00.000Z',
    updated_at: '2026-04-02T08:30:00.000Z',
  },
  {
    title: 'Office printer is offline',
    description: 'Users on the third floor cannot print documents because the shared printer shows as offline.',
    contact_info: 'helpdesk@company.com',
    status: 'accepted',
    created_at: '2026-04-02T09:00:00.000Z',
    updated_at: '2026-04-02T09:15:00.000Z',
  },
  {
    title: 'VPN connection drops after a few minutes',
    description: 'Remote staff report that the VPN session disconnects shortly after connecting from home.',
    contact_info: 'network@company.com',
    status: 'resolved',
    created_at: '2026-04-02T09:30:00.000Z',
    updated_at: '2026-04-02T10:10:00.000Z',
  },
  {
    title: 'Legacy workstation needs replacement',
    description: 'An old workstation in the finance area is no longer booting reliably and needs hardware replacement.',
    contact_info: 'asset-team@company.com',
    status: 'rejected',
    created_at: '2026-04-02T10:00:00.000Z',
    updated_at: '2026-04-02T10:00:00.000Z',
  },
];

const seedTickets = async () => {
  try {
    const existingResult = await pool.query(
      'SELECT title FROM tickets WHERE title = ANY($1::text[])',
      [sampleTickets.map((ticket) => ticket.title)]
    );

    const existingTitles = new Set(existingResult.rows.map((row) => row.title));
    const ticketsToInsert = sampleTickets.filter((ticket) => !existingTitles.has(ticket.title));

    if (ticketsToInsert.length === 0) {
      console.log('Seed skipped: sample tickets already exist');
      return;
    }

    for (const ticket of ticketsToInsert) {
      await pool.query(
        `INSERT INTO tickets (
          title,
          description,
          contact_info,
          status,
          created_at,
          updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          ticket.title,
          ticket.description,
          ticket.contact_info,
          ticket.status,
          ticket.created_at,
          ticket.updated_at,
        ]
      );
    }

    console.log(`Seeded ${ticketsToInsert.length} sample tickets`);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

seedTickets();
