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

One container runs MongoDB and the Node API, which also serves the built frontend. The single `app-data` volume stores the database, uploaded images and an automatically generated signing secret. MongoDB listens only inside the container; only the application port is published, on localhost.

The container starts with an empty database and does not import or modify an existing installation. Register through the interface. To make that account an administrator, open `docker compose exec app node` and run the following with your registered email:

```js
const mongoose = (await import('mongoose')).default
await mongoose.connect(process.env.MONGO_URI)
const User = (await import('./backend/models/userModel.js')).default
await User.updateOne({ email: 'your-registered-email@example.com' }, { $set: { isAdmin: true } })
await mongoose.disconnect()
```

Sign out and back in to see the admin menu. `docker compose logs -f` shows application/database logs; `docker compose down` stops the container and keeps the data. Avoid `docker compose down -v` unless you intend to delete that data. For a backup, stop the container and copy the entire volume. Public hosting requires HTTPS through a reverse proxy; this command publishes a local instance.

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
