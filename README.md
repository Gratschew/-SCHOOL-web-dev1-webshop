# Group 16

Member1:  Max Gratschew, max.gratschew@tuni.fi, 283272, 
resposible for: TODO, short description of duties 

Member2:  Simo Selinummi, simo.selinummi@tuni.fi, H283237, 
resposible for: TODO, short description of duties 



# WebDev1 coursework assignment

A web shop with vanilla HTML, CSS.


### The project structure

```
.
├── index.js                --> starting points of the backend server
├── package.json            --> TODO
├── routes.js               --> router that handles what happens after a request
├── auth                    --> authentication
│   └──  auth.js            --> handles the authentication of a user
├── controllers             --> controllers separated to simplify routes.js
│   ├── orders.js           --> controller for orders
│   ├── products.js         --> controller for products
│   └── users.js            --> controller for user
├── models                  --> data models
│   ├── db.js               --> model for the database
│   ├── order.js            --> model for an order
│   ├── product.js          --> model for a product
│   └── user.js             --> model for a user
├── public                  --> UI handling
│   ├── img                 --> 
│   ├── js                  --> connects the UI to the server
│   └── css                 --> styles the UI
├── utils                   --> TODO
│   ├── render.js           --> responsible for serving files from "public/"
│   ├── requestUtils.js     --> functions for handling requests
│   └── responseUtils.js    --> functions for handling responses
└── test                    --> tests
│   ├── auth                --> tests for authentication
│   ├── controllers         --> tests for controllers
└── └── own                 --> own tests that were created


```

TODO: describe added files here and give them short descriptions

## The architecture 

TODO: describe the system, important buzzwords include MVC and REST.
UML diagrams would be highly appreciated.


## Tests and documentation

TODO: Links to at least 10 of your group's GitLab issues, and their associated Mocha tests and test files.
Gitlab issues:
- https://course-gitlab.tuni.fi/webdev1-autumn-2021/webdev1-group16/-/issues/1
- https://course-gitlab.tuni.fi/webdev1-autumn-2021/webdev1-group16/-/issues/2
- https://course-gitlab.tuni.fi/webdev1-autumn-2021/webdev1-group16/-/issues/3
- https://course-gitlab.tuni.fi/webdev1-autumn-2021/webdev1-group16/-/issues/4
- https://course-gitlab.tuni.fi/webdev1-autumn-2021/webdev1-group16/-/issues/5
- https://course-gitlab.tuni.fi/webdev1-autumn-2021/webdev1-group16/-/issues/6
- https://course-gitlab.tuni.fi/webdev1-autumn-2021/webdev1-group16/-/issues/7
- https://course-gitlab.tuni.fi/webdev1-autumn-2021/webdev1-group16/-/issues/8
- https://course-gitlab.tuni.fi/webdev1-autumn-2021/webdev1-group16/-/issues/9
- https://course-gitlab.tuni.fi/webdev1-autumn-2021/webdev1-group16/-/issues/10

Created tests:
- /test/own/own_users.test.js


## Security concerns

TODO: list the security threats represented in the course slides.
Document how your application protects against the threats.
You are also free to add more security threats + protection here, if you will.

- Passwords are stored after hashing and salting
