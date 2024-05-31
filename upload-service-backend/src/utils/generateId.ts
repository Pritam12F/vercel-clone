export const generateId = () => {
  let str = "";
  let alpha = "abcdefghijklmnopqrstuvwxyz";

  const random = Math.floor(Math.random() * 100000) + 1;

  for (let i = 0; i < 5; ++i) {
    const randomAl = alpha[Math.floor(Math.random() * 26)];
    str += randomAl;
  }

  str = str.concat(random.toString());

  return str;
};
