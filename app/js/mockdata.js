mockdoc = [
  [0, true,  1,  'html', 'lang', ['en']],
  [1, true,  1,  'head'],
  [2, true,  1,  'title'],
  [3, true,  3,  'This is the Document Title'],
  [1, true,  1,  'body', 'class', ['licious']],
  [2, true,  1,  'div', 'class', ['something']],
  [3, true,  3,  'Some text for the textnode here'],
  [3, false, 1,  'div', 'title', ['commented out element']],
  [4, false, 3,  'Commented out text node'],
  [2, true,  1,  'input', 'name', ['usermail'], 'type', ['email'], 'value', 'placeholder', ['john@thingsee.com']]
]
//row[2] means the node type, it's browsers built in Node.NODE_TYPE constants
//property names are always strings, property values are arrays, each property can have multiple values (this is so it's easy to add functionality for manipulating multiple classes later)
