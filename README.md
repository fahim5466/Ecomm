# Ecomm
 E-commerce site made using Javascript.

 The site has two types of users, shoppers and admins. Shoppers can browse products and add them to a shopping cart. Only admins can access the admin section. Admins can add, edit and delete products. The admin section requires authentication and provides signup, sigin and signout features.

Some implementation details:
- The project uses simple json files and the repository pattern for persisting data about users, products and carts.
- Cookie base authentication is used. Password is properly salted and hashed before storage.
- Custom validators are used to validate user input.
- Authentication and validation used through custom middlewares

![ecomm-shop](https://github.com/fahim5466/Ecomm/assets/41055243/d72f9a4f-f548-4a39-9973-0630f1893ce1)

![ecomm-admin](https://github.com/fahim5466/Ecomm/assets/41055243/1737e3a6-82c8-4a41-a341-2dc636f9a165)
