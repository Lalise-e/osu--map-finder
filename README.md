# map finder
A browser application meant to fetch random osu! maps and download them

## How to run
You'll need any http server that can send files via a GET request, make sure you don't run it on a forwarded port as there is 0 protection for the api key.

You will also need an osu! legacy api key which can be found at https://osu.ppy.sh/p/api which should be put into ./scripts/key.js
You will need an account which is free to make but osu! does have a pretty strict 1 account per person policy.
Application name and url can be whatever but the url needs to be a valid url but something like http://localhost:5001 will do.

## Flaws
Regretfully due to lack of api support and CORS related issues I have only been able to make direct downloads work which is a paid feature.
I spent quite a lot of time trying to make browser downloads work but sadly no success.

## Resources used
Api documentation: https://github.com/ppy/osu-api/wiki

Design kit for some elements can be found at https://osu.ppy.sh/wiki/en/Brand_identity_guidelines
