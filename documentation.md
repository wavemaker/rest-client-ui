# Introduction

Looking to enhance your application's capabilities with robust API testing and request functionality? Our API Testing and Request Library is the ideal solution. Seamlessly integrate this powerful library into your application to simplify API interactions, streamline testing, and ensure the reliability of your API-dependent features.
This library can be easily be integrated into both React and Angular applications.

## User Interface

Currently we have four different implementations of our application. They are FullScreen Mode, Dialog Mode, Prefilled Mode, and Config Mode for both react and angular.

### Full Screen Mode

Full Screen Mode is used to display the application in full screen.

### Dialog Mode

Dialog Mode is used to display the application in a dialog box.

### Prefilled Mode

Prefilled Mode is for displaying the application in prefilled with different options and settings.

### Config Mode

Config Mode is used to display the OAuth application configuration in a dialog box.

### HTTP Methods

First the http method selection, it consists of six options they are GET, POST, PUT, PATCH, DELETE, and HEAD requests that are allowed to be made in the application.

### URL TextBox

Here we can enter the URL of the API endpoint you want to access. Eg, "<https://jsonplaceholder.typicode.com/posts>".
Also we can place dynamic paths in the URL string like "<https://jsonplaceholder.typicode.com/{path}>". "{path}" can be replaced to the path of the API endpoint you want to access

### Test Button

The test button can be used to test make an API request to the requested API endpoint.

### Use Proxy

If "Use proxy" is turned ON it is used to send the requested API endpoint to the wavemaker backend server and get the response back.
If "Use proxy" is turned OFF it is used to send the requested API endpoint directly to the requested server and get the response back.

### Parameters

There are five parameters to pass to the server when creating the request object and getting the response back from the server.

#### Authorization Parameter

Authorization parameter have three types. They are NONE, BASIC and OAuth2.0

##### NONE

NONE is the default value for the authorization parameter when creating the request object. If it is set to NONE then request object will not have any authorization.

##### BASIC

Basic is the second type of authorization parameter when creating the request object. If it is set to BASIC the user needs to enter the username and password.

##### OAuth2.0

OAuth2.0 is the third type of authorization parameter when creating the request object. If it is set to OAuth2.0 the user will be prompted with a dialog box to choose an Oauth provider(eg, Google, Amazon, Twitter).
After choosing an OAuth provider the user will be prompted with another dialog box to enter the Oauth provider deatails like client_id, client_secret and scopes etc.

#### Header Parameter

Header parameters are used for user-defined custom HTTP headers for a request, for example, the APIKey could be a HTTP Header parameter.
Header parameters are optional parameters for the request object that will be sent to the server when the request is made.

#### Body Parameter

Body parameter is defined in the operation's parameters section and includes the following: in: body. schema that describes the body data type and structure. The data type is usually an object, but can also be a primitive (such as a string or number) or an array.
Body parameters are optional parameters for the request object that will be sent to the server when the request is made.
Body parmameters consists of multiple content types like text/plain, application/json etc.
With multipart/form-data you can upload multiple files as well.
You can even create your own content type by using the add button.

#### Query Parameter

Query parameters are a defined set of parameters attached to the end of a URL. They are extensions of the URL that are used to help define specific content or actions based on the data being passed. To append query params to the end of a URL, a '? ' Is added followed immediately by a query parameter.
Query parameters are optional parameters for the request object that will be sent to the server when the request is made.

#### Path Parameter

Path parameters are variable parts of a URL path. They are typically used to point to a specific resource within a collection, such as a user identified by ID. A URL can have several path parameters, each denoted with curly braces { }.
Path parameters are optional parameters for the request object that will be sent to the server when the request is made.

### Response Tabs

The response is shown in three different tabs. They are the response body, the response headers and the response status.
