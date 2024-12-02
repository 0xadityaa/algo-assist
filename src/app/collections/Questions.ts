import { HTMLConverterFeature, lexicalEditor, lexicalHTML } from '@payloadcms/richtext-lexical';
import { CollectionConfig } from 'payload';


const Questions: CollectionConfig = {
  slug: 'questions',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
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
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          // The HTMLConverter Feature is the feature which manages the HTML serializers.
          // If you do not pass any arguments to it, it will use the default serializers.
          HTMLConverterFeature({}),
        ],
      }),
    },
    lexicalHTML('body', { name: 'body_html' }),
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