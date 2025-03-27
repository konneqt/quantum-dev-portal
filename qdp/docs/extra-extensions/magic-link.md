---
sidebar_position: 1
---

# Magic Link 

Magic Link Authorization is a secure and user-friendly authentication method designed for QIAM. It simplifies the login process by sending a one-time-use link to the user’s email, allowing them to authenticate without the need for passwords. This approach enhances security while providing a seamless user experience. See the following flow:

```mermaid
sequenceDiagram
User ->> Email: User with this e-mail exists? 
Email->> MagicLink: If user Exists
MagicLink->> User: Send E-Mail to existing user
User->> MagicLink: Authenticated and validated Session
```

## How It Works

* **User Initiates Login**: The user enters their email address on the QIAM login page and requests access.

* **Magic Link Generation**: The QIAM generates a unique, time-sensitive magic link and sends it to the user's email.

* **User Clicks the Link**: The user receives the email and clicks the magic link, which redirects them to the QIAM.

* **Automatic Authentication**: Upon clicking the link, the user is automatically authenticated and granted access to the application.

## Benefits

* **Enhanced Security**: Magic links reduce the risk of password-related attacks, such as phishing and brute force, as users don’t need to remember or enter passwords.

* **Improved User Experience**: Users enjoy a hassle-free login process without the frustration of forgotten passwords or complex authentication steps.

* **Time-Limited Access**: Magic links are valid for a short duration, reducing the risk of unauthorized access if the link is compromised.

* **Reduced IT Support Load**: Fewer password resets and login issues translate to lower support costs and improved operational efficiency.

## Configuring MagicLink in QIAM

The first step is to make sure that you Realm has the e-mail properly configured: 

![Email Config](./img/config_email.png)

Now, it's time to change the Authentication/Browser Flow:

![Config Browser Flow](./img/config_browser_flow.png)

1- Into your Realm, go to Authentication Left Menu

2- We will use just the user form, as we don't require the password, as the link will be the authorizing the user according his e-mail. If the user exists, an e-mail will be sent. [ Required ]

3- Add the Flow "MagicLink Authenticator" as Required.

## Demonstration

[Configuring the Magic Link](https://app.guidde.com/playbooks/vYj9NoMJtbyZU4zUNkbSK8)
==============================================================

[Click here to watch](https://app.guidde.com/share/playbooks/vYj9NoMJtbyZU4zUNkbSK8)

### ![Quick guidde](https://static.guidde.com/v0/qg%2FjROEQTCQdjb1TSow8xRZCKdyjlp2%2FvYj9NoMJtbyZU4zUNkbSK8%2F16BzusizSC6XohGshJ4xuV_cover.png?alt=media&token=d747a3bf-cece-4c97-a330-3c6339f281f0)

### Go to [localhost:8080](http://localhost:8080)

### 1\. Click "Authentication"

Click on "Authentication"

[Learn more](https://app.guidde.com/playbooks/vYj9NoMJtbyZU4zUNkbSK8#uP7sNqDteR6Toyr5Q9JxCF)  

![Click 'Authentication'](https://static.guidde.com/v0/qg%2FjROEQTCQdjb1TSow8xRZCKdyjlp2%2FvYj9NoMJtbyZU4zUNkbSK8%2F16BzusizSC6XohGshJ4xuV_doc.png?alt=media&token=a65946c1-4628-4f64-9b0e-d15e57c85392)

### 2\. Click "MagicLink"

Navigate to "MagicLink"

![Click 'MagicLink'](https://static.guidde.com/v0/qg%2FjROEQTCQdjb1TSow8xRZCKdyjlp2%2FvYj9NoMJtbyZU4zUNkbSK8%2FuP7sNqDteR6Toyr5Q9JxCF_doc.png?alt=media&token=23c7539e-5770-4e32-972d-567ebc21e8b4)
[QIAM Magic Link Demonstration](https://app.guidde.com/playbooks/mC8YVYB4VAzTGTYmRC2hEi)
========================================================================================

[Click here to watch](https://app.guidde.com/share/playbooks/mC8YVYB4VAzTGTYmRC2hEi)

### ![Quick guidde](https://static.guidde.com/v0/qg%2FjROEQTCQdjb1TSow8xRZCKdyjlp2%2FmC8YVYB4VAzTGTYmRC2hEi%2F951xnNwPt3hrwZpcXEKFXf_cover.png?alt=media&token=3fc32a4f-a531-4a5f-9553-776fcbb2dc87)

### Go to [localhost:8080](http://localhost:8080)

### 1\. Click "Sign in"

Click on "Sign in"

![Click 'Sign in'](https://static.guidde.com/v0/qg%2FjROEQTCQdjb1TSow8xRZCKdyjlp2%2FmC8YVYB4VAzTGTYmRC2hEi%2F951xnNwPt3hrwZpcXEKFXf_doc.png?alt=media&token=c55c23dc-26c5-4544-bb0f-05c5fdcd4ac1)

### 2\. Click "Username or email"

Navigate to "Username or email"

![Click 'Username or email'](https://static.guidde.com/v0/qg%2FjROEQTCQdjb1TSow8xRZCKdyjlp2%2FmC8YVYB4VAzTGTYmRC2hEi%2F9zbwFMQvutcdnuCMjPXXaS_doc.png?alt=media&token=935cae00-f309-42ff-b902-1ce8901ac3c2)

### 3\. Fill with the user name

Fill in with the user name

![Fill with the user name](https://static.guidde.com/v0/qg%2FjROEQTCQdjb1TSow8xRZCKdyjlp2%2FmC8YVYB4VAzTGTYmRC2hEi%2Fo9UeCT52DKd8qenhDyeh2v_doc.png?alt=media&token=36bfe387-8490-41d8-aa95-cb9aafac733a)

### 4\. Click "Sign In"

Select the "Sign In" option

![Click 'Sign In'](https://static.guidde.com/v0/qg%2FjROEQTCQdjb1TSow8xRZCKdyjlp2%2FmC8YVYB4VAzTGTYmRC2hEi%2FeosXDaBqYTYV3xYUdjKcrn_doc.png?alt=media&token=cc8cc8a6-ce3a-402e-b23c-4a06028265d5)

### 5\. Click "We've mailed you a passwordless login link. See your emais inbox for details."

As you can see, the QIAM Login Page will inform you that a magic link was sent, time to check your e-mail

![Click 'We've mailed you a passwordless login link. See your emais inbox for details.'](https://static.guidde.com/v0/qg%2FjROEQTCQdjb1TSow8xRZCKdyjlp2%2FmC8YVYB4VAzTGTYmRC2hEi%2FwzmY3JZmYDT4J2gY6reFCN_doc.png?alt=media&token=efa88e0b-0697-4460-aec3-efc1cb3389ef)

### 6\. Switch to "mail.google.com"

Navigate to "mail.google.com" in your web browser.

![Switch to 'mail.google.com'](https://static.guidde.com/v0/qg%2FjROEQTCQdjb1TSow8xRZCKdyjlp2%2FmC8YVYB4VAzTGTYmRC2hEi%2FcdqwYKPydpbr7kKj1VrehR_doc.png?alt=media&token=f64c9340-c2bc-451f-8166-1552ce8a692f)

### 7\. Click "QIAM Passwordless for Login"

Click on the "QIAM Passwordless for Login" field

![Click 'QIAM Passwordless for Login'](https://static.guidde.com/v0/qg%2FjROEQTCQdjb1TSow8xRZCKdyjlp2%2FmC8YVYB4VAzTGTYmRC2hEi%2Fi3XKjYX59C5ii3wcSGYBBF_doc.png?alt=media&token=6dd93fce-b108-47e3-a44f-b3a37bc89d37)

### 8\. Click "Click to sign in"

Open the email, sent by QIAM as your magic link and click on the "Click to sign in" button.

![Click 'Click to sign in'](https://static.guidde.com/v0/qg%2FjROEQTCQdjb1TSow8xRZCKdyjlp2%2FmC8YVYB4VAzTGTYmRC2hEi%2Fa6HEN7YvESA13pV6fwkS6F_doc.png?alt=media&token=dc0655c1-98a8-480f-8943-2621ae186953)

### 9\. Switch to "localhost:8080"

And now, your session is properly authenticated

![Switch to 'localhost:8080'](https://static.guidde.com/v0/qg%2FjROEQTCQdjb1TSow8xRZCKdyjlp2%2FmC8YVYB4VAzTGTYmRC2hEi%2FhzYSzYBVmXFPV4ShPgRK7h_doc.png?alt=media&token=56594556-54c3-4175-835b-d86ff39290f2)

### 10\. Click on profile link on the top

Check the Profile Option

![Click on profile link on the top](https://static.guidde.com/v0/qg%2FjROEQTCQdjb1TSow8xRZCKdyjlp2%2FmC8YVYB4VAzTGTYmRC2hEi%2FgAwFCi3D838oK341yS8sMW_doc.png?alt=media&token=46ae2698-7b6b-4e1f-a0d1-48f69d2b73ec)

### 11\. Click "Personal info"

Select Personal Info, and check the authenticated user's information

![Click 'Personal info'](https://static.guidde.com/v0/qg%2FjROEQTCQdjb1TSow8xRZCKdyjlp2%2FmC8YVYB4VAzTGTYmRC2hEi%2F36cwcop8CJvKgUr5Nw96gb_doc.png?alt=media&token=d4efbee6-4367-418f-9d5f-22522f79f7d2)

Explore the QIAM Magic Link feature through a step-by-step demonstration. Learn how to sign in, access emails for passwordless login, and navigate personal information effortlessly.

