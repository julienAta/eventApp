# JUNBI - Event Management Platform

JUNBI is a comprehensive event management platform designed to simplify the organization and coordination of events. From casual meetups to professional gatherings, JUNBI provides all the tools needed to create, manage, and participate in events efficiently.

## 🌟 Features

- **Event Creation & Management**: Create and manage both private and public events
- **Real-time Chat**: Integrated messaging system for event participants
- **Expense Tracking**: Keep track of event-related expenses and split costs
- **Participant Management**: Easy handling of event participants and RSVPs
- **Responsive Design**: Seamless experience across all devices

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- pnpm (recommended) or npm
- Git
- PostgreSQL (handled through Supabase)

### Installation

1. Clone the repository

```bash
git clone https://github.com/julienAta/eventApp
cd eventApp
```

2. Install server dependencies

```bash
cd server
pnpm install  # or npm install
cd ..
```

3. Install client dependencies

```bash
pnpm install  # or npm install
```

4. Configure environment variables

- Locate the environment variables file in the `livrables` folder
- Create a `.env` file in the root directory
- Copy the contents from the provided file

### Running the Application

#### Development Environment

```bash
pnpm dev
```

#### Production Environment

```bash
pnpm build
pnpm start
```

## 💻 Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **Backend**: Node.js, Express
- **Database**: PostgreSQL (Supabase)
- **Styling**: Tailwind CSS, Sass
- **Authentication**: Supabase Auth

## 🛠️ Project Structure

```
eventApp/
├── src/             # Application source code
├── server/          # Backend server code
├── public/          # Static files
├── components/      # React components
├── styles/          # CSS and styling files
└── livrables/       # Project deliverables and documentation
```

## 🔐 Environment Variables

Required environment variables (found in `livrables/env-variables.txt`):

- Database configuration
- API keys
- Authentication settings

## 📱 Features Overview

1. **User Management**

   - Registration and authentication
   - Profile management
   - User roles and permissions

2. **Event Management**

   - Create and edit events
   - Manage participants
   - Event details and updates

3. **Communication**

   - Real-time chat
   - Participant notifications
   - Event updates

4. **Financial Management**
   - Expense tracking
   - Cost sharing
   - Payment records

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- Julien Atanassov - Full Stack Developer

## 📞 Support

For support, please contact [contact information] or open an issue on GitHub.

---

Built with ❤️ using Next.js and Supabase
