type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const SearchPage = async (props: { searchParams: SearchParams }) => {
  const searchParams = await props.searchParams;
  return <div>{JSON.stringify(searchParams)}</div>;
};

export default SearchPage;
