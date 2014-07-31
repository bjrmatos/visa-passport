# Visa-passport 
<img src="http://i.imgur.com/21rXfJC.png?1" align="right"/>

Visa-passport is a [Express](http://expressjs.com/)-compatible authorization provider.

Visa-passport purpose is to manage role based authorization but it does through resource/activity checks ([see this](http://lostechies.com/derickbailey/2011/05/24/dont-do-role-based-authorization-checks-do-activity-based-checks/)), which enables not hardcode roles in code. It's database/backend agnostic, if a backend implementation plugin exists for your database it can manage authorization for you. Visa-passport assumes a particular database schema, but you can override its implementation to suit with your app, which maximizes flexiblity and
allows application-level decisions to be made by the developer.  

The API is simple: you provide a method to find the user in your app, and Visa-passport provides methods and middleware for manage authorization through your database/backend.


This module is not dependent but heavily inspired by [Passport.js](https://github.com/jaredhanson/passport) and works great with this module.

## Install

`npm install visa-passport`

## Usage

#### Get user

Because Visa-passport not handle authentication, it exposes `visa.getUser(fn)` for identify the user in your app, you can pass the user to `done(err, user)` from the request object or read it from your database.

```js
visa.getUser(function(req, done) {
  done(null, req.user);
});
```

#### Configure Backend

Visa-passport uses backend implementations for find the permissions in your app, for configure a backend, call `visa.use(new MyFavoriteBackendImplementation)`.

```js
visa.use(new visa.MemoryBackend());
```

#### Middleware

To use Visa-passport in an [Express](http://expressjs.com/) or
[Connect](http://senchalabs.github.com/connect/)-based application configure it
with the required `visa.initialize()` middleware.

```js
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(bodyParser());
app.use(session({ secret: 'SECRET' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(visa.initialize())
```
#### Authorize Requests

Visa-passport provides an `authorize()` function, which is used as route
middleware to authorize requests.

```js
app.post('/forbidden', visa.authorize({ failureRedirect: '/unauthorized' }),
function(req, res) {
	res.render('forbidden');
});
```

## Backend Implementations

* MemoryBackend: Read a json file with your permissions and store them in memory

## API 

..WORK IN PROGRESS..

## Examples

* [MemoryBackend](https://github.com/borismcr9/visa-passport/tree/master/examples/memory-backend)

## Future Work

* Mongodb backend implementation
* add more methods for manage authorization
* add session-cache support for authorization results

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2014 BJR Matos <[https://github.com/borismcr9/](https://github.com/borismcr9/)>
Licensed under the MIT license.
