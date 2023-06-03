import slugify from 'slugify';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const webhookToken = process.env.WEBHOOK_TOKEN; // webhook token stored in client side and server side should match

    const { event, model: collection, entry } = req.body;
    const { authorization } = req.headers;
    if (webhookToken === authorization) {
      if (collection === 'product') {
        const path = `/product/${slugify(entry.name)}`;
        await res.revalidate(path);
      } else if (collection === 'shop') {
        const path = `/shops/${slugify(entry.name)}`;
        await res.revalidate(path);
      } else if (collection === 'request') {
        const path = `/request/${slugify(entry.name)}`;
        await res.revalidate(path);
      }
      console.log("💥revalidate💥")
      return res.status(200).json({ revalidated: true });
    } else {
      return res.status(401).send('Invalid Authorization Header');
    }
  } else {
    res.status(400).json({ message: 'Invalid request method lol' });
  }
}
