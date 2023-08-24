# Frontend Ecommerce Project - README

Welcome to the Frontend Ecommerce project built with Next.js and Strapi! This repository contains the frontend code that powers a feature-rich online shopping experience. Below, you'll find information about the project, its features, and how to get started.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Admin Dashboard](#admin-dashboard)
- [Customer Dashboard](#customer-dashboard)
- [Contributing](#contributing)
- [License](#license)

## Introduction

This project is a comprehensive ecommerce solution that seamlessly integrates the frontend developed with Next.js and the backend powered by Strapi. It offers an array of features to enhance the shopping experience for users while providing convenient management tools for administrators.

## Features

1. **Product Management**
   - Add products with and without sizes, including options for clothing sizes and shoe sizes.
   
2. **User Product Requests**
   - Users can request products, which are subject to review by the owner.
   - Owner can approve requested products, enabling user interaction through comments.
   
3. **Comment Management**
   - Users can comment on approved requested products.
   - Admins can moderate comments, banning or deleting inappropriate content.
   
4. **Cart Persistence**
   - User carts are saved to the database, ensuring continuity across sessions.
   
5. **Authentication**
   - Secure user authentication for personalized shopping experiences.
   
6. **Shop Management**
   - Ability to add shops and associate products with them.
   
7. **Responsive Design**
   - Fully responsive layout for mobile, tablet, and laptop users.
   
8. **Progressive Web App (PWA)**
   - Users can install the app for enhanced offline and cache capabilities.
   
9. **Firebase Push Notifications (FCM)**
   - Stay informed with push notifications about orders and updates.
   
10. **Number Verification**
    - OTP-based number verification for enhanced security.
   
11. **Search and Filtering**
    - Basic and advanced search functionalities for products.
    - Filtering, sorting, and limiting are handled via the backend API.
   


## Admin Dashboard

The admin dashboard provides different privileges based on user roles:

- Admins can manage orders and assign delivery personnel.
- Delivery personnel can update order delivery details and status.

## Customer Dashboard

Customers have their own dashboard with the following features:

- View and track orders.
- Manage personal details and addresses.
- See requested products.



## Installation

1. Clone this repository to your local machine.
2. Navigate to the project directory and run `npm install` to install dependencies.

## Usage

1. Run `npm run dev` to start the development server.
2. Access the application at `http://localhost:3000`.

## Contributing

We welcome contributions from the community! If you find a bug or have an enhancement in mind, please open an issue or submit a pull request.


---

Thank you for your interest in our Frontend Ecommerce project! If you have any questions or feedback, please don't hesitate to get in touch. Happy shopping! 🛍️
