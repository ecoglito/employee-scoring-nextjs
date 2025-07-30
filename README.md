# Employee Scoring Next.js Application

A comprehensive employee scoring and management system built with Next.js, featuring integration with Notion databases for employee data management.

## Features

- **Employee Management**: Add, edit, and view employee profiles
- **Scoring System**: Track and manage employee performance scores
- **Team Dashboard**: Visualize team performance and statistics
- **Notion Integration**: Sync employee data from Notion databases
- **Authentication**: Secure login system with NextAuth
- **Interactive Maps**: Team location visualization
- **Real-time Updates**: Live data synchronization

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Authentication**: NextAuth.js
- **Database**: PostgreSQL with Prisma ORM
- **Charts**: Recharts for data visualization
- **Maps**: Leaflet for geographic visualization

## Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Notion API token (if using Notion integration)

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/employee_scoring"

# NextAuth
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# Notion Integration (optional)
NOTION_TOKEN="your-notion-api-token"
NOTION_DATABASE_ID="your-notion-database-id"
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/ecoglito/employee-scoring-nextjs.git
cd employee-scoring-nextjs
```

2. Install dependencies:
```bash
npm install
```

3. Set up your database:
```bash
npx prisma migrate dev
npx prisma generate
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Notion Integration

To use the Notion integration features:

1. Create a Notion integration at [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Get your API token and database ID
3. Set the environment variables `NOTION_TOKEN` and `NOTION_DATABASE_ID`
4. Run the sync script:
```bash
NOTION_TOKEN="your-token" node scripts/notion-sync.js
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `node scripts/notion-sync.js` - Sync data from Notion

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The application can be deployed on any platform that supports Next.js applications like:
- Netlify
- Railway
- AWS
- Digital Ocean

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Security

- Never commit API tokens or secrets to the repository
- Use environment variables for all sensitive configurations
- The Notion sync script requires the `NOTION_TOKEN` environment variable

## License

This project is licensed under the MIT License.
