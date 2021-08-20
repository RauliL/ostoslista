import * as yup from 'yup';

export const entrySchema = yup.object().shape({
  id: yup.string().uuid().optional(),
  text: yup.string().required().max(150),
  done: yup.boolean().required(),
});
