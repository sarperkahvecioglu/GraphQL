export const authors = [
    {
      id: "001",
      name: "Alexis",
      surname: "Jordan",
      age: 22,
      books: [
        { id: "first01", title: "Alexis Jordan's First Book", score: 3.4, isPublished: false },
        { id: "second02", title: "Alexis Jordan's Second Book", score: 3.7, isPublished: true },
      ],
    },
    {
      id: "002",
      name: "Andrew",
      surname: "James",
      age: 21,
      books: [
        { id: "first1", title: "Andrew James' First Book", score: 3.4, isPublished: false },
        { id: "second2", title: "Andrew James' Second Book", score: 3.7, isPublished: true },
      ],
    },
  ];
  
  export const books = [
    {
      title: "Life Passed",
      author: authors[0],
      id: "1",
      score: 6.9,
      isPublished: true,
    },
    {
      title: "Mom",
      author: authors[1],
      id: "2",
      score: 7.4,
      isPublished: true,
    },
  ];
  