const initUrl =
  "https://tns4lpgmziiypnxxzel5ss5nyu0nftol.lambda-url.us-east-1.on.aws/challenge";

export async function fetchBody(url?: string) {
  const response = await fetch(url || initUrl);
  if (!response.ok) throw new Error(`Response status: ${response.status}`);

  return await response.text();
}
