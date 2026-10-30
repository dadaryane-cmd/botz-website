/** The founders who handle a service (`services` in content/people.json), in their listed order. */
export const responsibleFor = (people, service) =>
  people.filter((person) => person.services.includes(service))
