# DECISIONS

> Keep this short and honest — bullet points are fine. We read this before the
> walkthrough. There are no wrong answers here; we're looking for judgment, not
> justification. "I didn't have time to understand X, so I left it out" is a perfectly
> good entry.

## 1. Tech & structure choices

- **Framework:** _Vue or React — why this one for you?_
- Vue. It's the framework that I've used and built most of applications with

- **Component structure:** _how did you split components, and why? What's a container
  vs. a presentational piece here?_

* I would usually separate components in as /core/ for core components like buttons, modals etc. and named folder for components that are related to eachother e.g. /components/CarRegistration.
* I've split components in the sense of, pieces of template that could are repeated will get their own component (AppButton)
* Pieces of code that could be named for readability and expendability (even tho used once) are converted to component (Registration List view items)
* Complex template with styling and logics are good to separate e.g. form components (Insert, update) form components

- **State management:** _local state, a store (Pinia/Redux/Zustand/Context), or just
  props? Why was that enough (or necessary)?_

* Only props for now, there was no immidiate necessity, time, complexity for composable and/or Pinia etc. Possibly current usecase for a store / composable for is for retrieving the registration in the edit and detail page (when navigating from overview page) and not have to refetch etc.

- **Styling:** _what approach, and why?_

* Styling done through tailwind. usually using theme'd tailwind colors so stay consistent.

* If time allows themeing and styling will be elevated. The primairy focus was functionality, making it beautiful comes afterwards.

## 2. Talking to the API

- How I **fetch data** and where that logic lives (component, composable/hook, service):

* Directly within the page component.

- How I handle **loading / error / empty** states:

* Using a fetch composable that tracks the loading, error, error state. with possibly automatically handles things like retries etc.

- How I'd **swap the mock for a real API** (base URL, auth header, env config):

* Design the mock to use realstic real API endpoints (GET/POST) from with /registrations endpoint. and when it comes to changing using the real API, change the Base API route to the API endppoint. Things like error handling I would like to API to return field based error e.g. errors{buildYear: can not be in the future}, which a form component can easily be build around to extract and show the error.

## 3. Forms & validation

- Where validation lives and how I show feedback to the user:
- An edge case I handled (or chose not to):

* If I have decisions over the BE implementation I would strongly advise that all and every sort of validation is handled on the Backend, Quick, fast and easy validations could also live on the Front-end but those are just for quick feedback rather than actual validating. e.g. required, must be a number, easy regex-able validations.

## 4. Trade-offs and scope

- What I **deliberately left out** (and why it's safe to leave out for now):
- What I'd do **differently** if this were production:
- The part of this app I'm **least confident about**:

* Store, beautiful styling, nicer loading states, responsiveness.
* As for the data being added,edit and deleted a separate page isn't something that I would say is a must, I would rather do it in a sidebar/modal. Authentication and Authorization For production application actual guarding the pages would be a must.
  implementing internationalisation (I81n) to allow multi-language. Adding a improved input component that accepts validation regex with use case of if it's a number input to disallow non numeric values to be entered with usage in the registration number (e.g. on any input to check wether it's allowed and only really update the modelValue if it's allowed). possibly adding caching

* Not that I am least confident off, but overal if time allowed, I would been able to implement it in a more of a "Production" version rather than a quick and dirty but functional prototype / prove of concept. Another point is that when template or code is generated with AI it most often generate too much, one thing is i possibly haven't gone 100% go over the and fine tune everything

## 5. AI usage

> Be specific. This helps us, and it helps you in the walkthrough.

- What I used AI for:
- What the AI suggested that I **rejected or rewrote**, and why:
- Something the AI got wrong or that I had to correct:

* Prompting it for what I wanted to be implemented, from project setup, setting up auto routing, installing tailwind and choosing a simple fitting theme as well as creating the sidebar, and form etc.
* Things like pages, forms etc was designed without components in mind. su same things like button was duplicated. these were small instructions that had to promp to change.
  It also generated inputs with errors directly in the form template, if which I've asked to separate into more maintainable input and form field components .
  as well as slight adjustments to where the AI tries adding things like props that aren't in the correct place or even needed e.g. title prop for form component, I would prefer the form component to just take care of rendering the inputs and handling and showing of error and not title etc those could just be defined and added outside.

## 6. With more time, next I would…

- I would use a better and more suitable components for things like modals (sidebar, alert) that has better keyboard escape key recognition to close, backdrop click to close but as well as tab safety that pressing tabs inside a form opened inside the modal it won't focus inputs outside the modal.
- Spend time on a proper design, making a design system and following it
- Possibly not use a route navigation for purpose of having to, seeing that CRUD operations are fully capable to being handled inside the same page and using optimistic saving for the clean and fast feeling.
- Simplifies needing to refetch / store data when editing etc.
