# BestContosoRetailers

## This is a program for retailing company Contoso (For now an imaginary one :-))

### You will need Node.js to run this program - if you don't have it yet please reffer https://nodejs.org/en/download/

##  Usage
### To start the program run "node --harmony main.js" under rhe package folder
### ex: source\repos\BestContosoRetailers\BestContosoRetailers\myProg>node --harmony main.js
### The harmony is just in case the node that you have is really old otherwise you can skip the --harmony


### Once progarm is running you can use -help to navigate your way around it
### In each relevant section you will have different options so try -help it's alwas there to help you browse around

### For each user that login there will be just one shipping cart available
### User can choose to move books in and out

### Here are currently supported options:

- [x] -help => shows a list of the options available to use on the command line
- [x] -create -user [userId] -pwd [password]    => creates a new account for userId
- [x] -signIn -user [userId] -pwd [password]    => sign in a user 
- [x] -signOut => signs out current user
- [x] -list [inStock | toBeShipped]  => lists all the books in the current stock, or the list of books to be shipped
- [x] -view [bookId]    => given a bookId, shows the info for that book
- [x] -order [bookId]    => “orders” a book by moving it from the “in stock” list to the “to be shipped” list
- [x] -return [bookId]    => returns a book (moves it from the “to be shipped” list back to the “in stock” list)

- [ ] -pack [width,height]    
- [ ] -web client/server
- [ ] -unit tests 
