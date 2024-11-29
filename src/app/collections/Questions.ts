import { CollectionConfig } from 'payload';


const Questions: CollectionConfig = {
  slug: 'questions',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'difficulty',
      type: 'select',
      options: [
        { label: 'Easy', value: 'easy' },
        { label: 'Medium', value: 'medium' },
        { label: 'Hard', value: 'hard' },
      ],
      defaultValue: 'easy',
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'topics',
      type: 'relationship',
      relationTo: 'topics',
      hasMany: true,
    },
    {
      name: 'companies',
      type: 'relationship',
      relationTo: 'companies',
      hasMany: true,
    },
    {
      name: 'body',
      type: 'richText',
    },
    {
      name: 'tests',
      type: 'array',
      fields: [
        {
          name: 'test',
          type: 'text',
        },
      ],
    },
  ],
};

export default Questions;