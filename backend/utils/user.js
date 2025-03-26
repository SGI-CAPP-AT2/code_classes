const fetchUser = async (token) => {
  const url = `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`;
  console.log(url);
  const response = await fetch(url);
  const data = await response.json();
  console.table(data);
  return data;
};

module.exports = { fetchUser };
