# Plotavela Homes

Plotavela is a MERN application for browsing real estate listings, reviewing properties, and managing accounts and listings.

Inspired by **Brad Traversy's [ProShop MERN project](https://github.com/bradtraversy/proshop_mern)** and the **[MERN eCommerce course on Udemy](https://www.udemy.com/course/mern-ecommerce/)**. The original real estate adaptation was created by Zsolt Keresztes as `PP_realestate_mern`.

Features:

- Sign up, sign in, and edit your profile
- Browse, search, and review properties
- Create, edit, and delete properties as an administrator
- Manage users and their roles as an administrator

## Run with Docker

```bash
docker compose up --build -d
```

Open [http://localhost:5000](http://localhost:5000). To use another port, run `APP_PORT=8080 docker compose up --build -d`.

Docker Desktop shows three containers in one Compose group: `fe` (frontend and HTTP proxy), `be` (Node API), and `mongodb` (database). Only the frontend port is published, on localhost. The backend and MongoDB communicate on a private network. The existing `app-data` volume retains the database, uploads and signing secret.

A new volume starts empty. When upgrading from the single-container setup, keep the same Compose project name and stop the old `app` container before starting the three services; they reuse its existing data. Run `docker compose up --build -d --remove-orphans` after stopping the old container. Register through the interface. To make that account an administrator, open `docker compose exec be node` and run the following with your registered email:

```js
const mongoose = (await import('mongoose')).default
await mongoose.connect(process.env.MONGO_URI)
const User = (await import('./backend/models/userModel.js')).default
await User.updateOne({ email: 'your-registered-email@example.com' }, { $set: { isAdmin: true } })
await mongoose.disconnect()
```

Sign out and back in to see the admin menu. `docker compose logs -f` shows application/database logs; `docker compose down` stops the containers and keeps the data. Avoid `docker compose down -v` unless you intend to delete that data. For a backup, stop the containers and copy the entire volume. Public hosting requires HTTPS through a reverse proxy; this command publishes a local instance.

### Load demo data

The seed data contains **6 properties and 3 demo users**. It is not loaded automatically when the containers start.

**Warning: running the seeder deletes all existing users and properties in the configured database before importing the demo data.** Use it only for a disposable local/demo installation; it does not ask for confirmation.

With the containers running, execute this command from the project directory:

```bash
docker compose exec be node backend/seeder.js
```

The backend imports the fixtures into the Docker MongoDB database. On success, it prints `Data Imported!`. Refresh [http://localhost:5000](http://localhost:5000); sign out and back in if you were already logged in, because seeding replaces the user records.

| Name | Email | Password | Role |
| --- | --- | --- | --- |
| Admin User | `admin@example.com` | `123456` | Administrator |
| John Doe | `john@example.com` | `123456` | Regular user |
| Jane Doe | `jane@example.com` | `123456` | Regular user |

These credentials are public demo credentials. Do not use these accounts on a publicly accessible installation. The fixtures are in [backend/data/users.js](backend/data/users.js) and [backend/data/properties.js](backend/data/properties.js).

## Screenshots

Screenshots use fictional demonstration accounts and listings.

![Welcome page](/screenshots/screenshot_welcomepage_2.png)

![Property listings](/screenshots/screenshot_welcome_page.png)

![Property details](/screenshots/screenshot_property_details.png)

![Admin screen: user management](/screenshots/screenshot_admin_users.png)

![Admin screen: property management](/screenshots/screenshot_admin_properties.png)

## License

[MIT](LICENSE). Original copyright: © 2021 Zsolt Keresztes.

## Contact

Maintainer: **Keresztes Zsolt** · [Website](https://kereszteszsolt.hu/) · [GitHub](https://github.com/kereszteszsolt)

## Buy Me a Coffee

[Support my work with a coffee](https://buymeacoffee.com/kereszteszsolt) · [Other ways to support](https://kereszteszsolt.hu/en/ways-to-support/)
