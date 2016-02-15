APP.doc.language = {
  id: 'html',
  name: 'HTML Simple',
  url: 'http://potato?',
  entities: [
    { //the first entity is the default type
      name: 'name',
      color: '#f92772',
      startsWith: [],
      endsWith: ['#', '.', ' '],
      next: ['id', 'class', 'attribute'],
      before: '', //always render this text before an entity of this type
      after: '', //always render this text after an entity of this type
      removalDeletes: ['row'], //if this entity is deleted, what goes with it
    },
    {
      name: 'attribute',
      color: '#a6e22d',
      startsWith: [],
      endsWith: [':'],
      next: ['value'],
      before: ' ',
      after: ':',
      removalDeletes: ['+ .value'], //TODO: how to configure deleting next something untils next something?
    },
    {
      name: 'value',
      color: '#e6db74',
      startsWith: [''],
      endsWith: [' '],
      next: ['attribute'],
      before: ' ',
      after: '',
      removalDeletes: [''],
    },
    {
      name: 'id',
      color: '#e6db74',
      startsWith: ['#'],
      endsWith: ['.', ' '],
      next: ['class', 'attribute'],
      before: '#',
      after: '',
      removalDeletes: [''],
    },
    {
      name: 'class',
      color: '#e6db74',
      startsWith: ['.'],
      endsWith: ['.', ' '],
      next: ['class', 'attribute'],
      before: '.',
      after: '',
      removalDeletes: [''],
    },
    {
      name: 'text',
      color: '#ffffff',
      startsWith: [' '],
      endsWith: [],
      next: ['row'],
      before: '',
      after: '',
      removalDeletes: [''],
    },
    {
      name: 'comment',
      color: '#75715e',
      startsWith: ['//'],
      endsWith: ['//'],
      next: ['text'],
      before: ' //',
      after: '// ',
      removalDeletes: [''],
    },
  ],
};
