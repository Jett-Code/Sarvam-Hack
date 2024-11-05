
https://github.com/user-attachments/assets/e0488aa7-b797-4dcf-952e-e1ad084614f5
# The current scope includes:
1. Video upload functionality for instructors
2. Automated translation of audio content to multiple Indian languages using Sarvam APIs
3. AI-generated images to illustrate key concepts, powered by Gemini
4. Automatic quiz generation based on video content
5. Basic user authentication and course management features

# The following features are currently out of scope:
1. Live video streaming or real-time translation
2. Advanced video editing tools like B-roll
3. Integration with existing educational platforms (unacademy, vedantu)
4. Mobile app version (current focus is on web application)
5. Automated voiceover generation in different languages.
6. Feedback tabs.

# Future opportunities include:
1. Expanding language support beyond Indian languages
2. Using hyden + eleven labs to dub the video
3. Implementing blockchain for secure certification and credentialing
4. Developing an API for third-party integrations and custom solutions

# Challenges we ran into
Using Sarvam's API to address the boundary condition was the main issue. Learning about boundary error and how to receive a return free of errors took a lot of time. The reason for the boundary error we were receiving when submitting requests to the Sarvam API through fetch() was that the boundary field in the form data needed to be manually defined. Additionally, we discovered that a sentence's meaning could vary when translating into Indian, so we preprocessed the response to account for that possibility and produce a better translation.

# links
1. https://github.com/Jett-Code/sarvam-frontend
2. https://huggingface.co/spaces/projektkush/googleaisarvam/tree/main

# Example Gallery


https://github.com/user-attachments/assets/52230e18-65e6-4e22-8b5b-61a589a0f8ff





