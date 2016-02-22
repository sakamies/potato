APP.language = {
  name: 'Slim Naïve',
  url: 'http://slim-lang.com',
  tokens: [
    {
      name: 'name',
      className: 'e1',
      color: '#f92772'
      startsWith: [], //if the first typed character is this, change type tothis type
      endsWith: ['#', '.', ' ', '='], //if the last character typed is this, make the next entity start as the corresponding type on the 'next' array
      next: ['id', 'class', 'text', 'code'],
      before: '', //always render this text before an entity of this type
      after: '', //always render this text after an entity of this type
    },
    {
      name: 'attribute',
      className: 'e2',
      color: '#a6e22d'
      startsWith: []
      endsWith: ['='],
      next: ['value'],
      before: ' ',
      after: '=',
    },
    {
      name: 'value',
      className: 'e3',
      color: '#e6db74'
      startsWith: ['"']
      endsWith: ['"'],
      next: [],
      before: '',
      after: '',
    },
    {
      name: 'id',
      className: 'e4',
      color: '#f92772'
      startsWith: ['#']
      endsWith: ['.', ' '],
      next: ['class', 'attribute'],
      before: '#',
      after: '',
    },
    {
      name: 'class',
      className: 'e5',
      color: '#f92772'
      startsWith: ['.']
      endsWith: ['.', ' '],
      next: ['class', 'attribute'],
      before: '.',
      after: '',
    },
    {
      name: '',
      className: 'e6',
      color: '#ffffff'
      startsWith: ['']
      endsWith: [],
      next: [],
      before: '',
      after: '',
    },
    {
      name: '',
      className: 'e7',
      color: '#ffffff'
      startsWith: ['']
      endsWith: [],
      next: [],
      before: '',
      after: '',
    },
    {
      name: '',
      className: 'e8',
      color: '#ffffff'
      startsWith: ['']
      endsWith: [],
      next: [],
      before: '',
      after: '',
    },
    {
      name: 'code',
      className: 'e9',
      color: '#ffffff'
      startsWith: ['-', '=', '==']
      endsWith: ['\n'],
      next: ['row'],
      before: '',
      after: '',
    },
    {
      name: 'text',
      className: 'e0',
      color: '#ffffff'
      startsWith: [' ', '|', '<']
      endsWith: ['\n'],
      next: ['row'],
      before: '',
      after: '',
    },
  ]
};
