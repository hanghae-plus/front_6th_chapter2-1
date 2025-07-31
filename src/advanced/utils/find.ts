interface FindByIdParams<T extends { id: unknown }> {
  data: T[];
  id: T['id'];
}

export function findById<T extends { id: unknown }>({
  data,
  id,
}: FindByIdParams<T>) {
  const item = data.find((item) => item.id === id);

  if (item) {
    return item;
  }

  throw new Error(`Item with id ${id} not found`);
}

export function safeFindById<T extends { id: unknown }>({
  data,
  id,
}: FindByIdParams<T>) {
  return data.find((item) => item.id === id) ?? null;
}
