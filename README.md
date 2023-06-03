# Loan Management API

## Description

The loan-management-api is a backend API developed with NestJS, Prisma and MongoDB for managing loans. It is an integral part of a larger loan management system that also includes a user-friendly frontend interface (loan-management-ui) and a configuration repository for deployment (loan-management-deployment).

## Features

This API is responsible for the following features:

- User management: This allows users to access the platform.
- Borrower management: Manages all information related to the borrowers.
- Loan management: Handles loan-related information.
- Payment tracking: Keeps track of all loan payments.
- PDF Statement generation: Provides detailed PDF statements for loan transactions.
- Concept management: Manages different transaction concepts.
- Payment history: Provides a detailed history of all loan payments.
- Loan payment projection: Provides future projections for loan payments.
- Overdue information: Provides information about overdue days for a loan.
- Dashboard: Presents monthly statistics of income, defaulting borrowers, and income per each configured concept.

## Getting Started

Clone the repository:
```bash
$ git clone https://github.com/{your_username}/loan-management-api.git
$ cd loan-management-api
```

Install the dependencies:

```bash
$ npm install
```

To sync Prisma with MongoDB, run:

```bash
$ npm run prisma:migrate
```

## Database Configuration

You will need to set up a MongoDB Cloud account, create a database, and configure the DATABASE_URL environment variable with your MongoDB connection string.

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```



## Deployment

Refer to the [loan-management-deployment](https://github.com/fsiatama/loan-management-deployment.git) repository for instructions on how to deploy the entire platform, including this backend API.

## Related Repositories

- [loan-management-deployment:](https://github.com/fsiatama/loan-management-deployment.git)  Contains the Docker Compose and Nginx configurations needed for deploying the loan management system.
- [loan-management-ui:](https://github.com/fsiatama/loan-management-ui.git) The frontend user interface for the loan management system.

For any additional information or queries, feel free to open an issue.

## License

This project is licensed under the terms of the MIT license. See the [MIT licensed](LICENSE) file for license rights and limitations.
