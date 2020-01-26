# Devbackend

Steps:
1. Install typescript: npm install -g typescript ts-node
2. Install dependencies: npm install
3. Run the database DDL.
4. Create user shoppingcart
5. npm install -g sequelize-auto
6. npm install -g mysql
7. Run sequelize-auto: 
    cd lib
    sequelize-auto -z -o .\models\ -d shoppingcart -h localhost -u shoppingcart -p 3306 -x shoppingcart -e mysql
