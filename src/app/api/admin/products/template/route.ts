import { NextResponse } from 'next/server';

export async function GET() {
  const headers = [
    'Name',
    'Category',
    'Description',
    'Ingredients',
    'Storage',
    'Sizes (Format: label:price:mrp | label:price:mrp)',
    'Price (Single Size)',
    'MRP (Single Size)',
    'Badge',
    'InStock',
    'Emoji',
  ];

  const sampleRows = [
    [
      '"Tomato Thokku"',
      '"Pickles & Thokkus"',
      '"Slow-cooked country tomatoes tempered with mustard seeds and cold-pressed gingelly oil."',
      '"Ripe Tomatoes, Cold-Pressed Sesame Oil, Mustard, Fenugreek, Red Chilli, Curry Leaves."',
      '"Store in cool dry place. Use clean spoon."',
      '"300g:120:145 | 500g:190:230 | 1kg:360:440"',
      '190',
      '230',
      '"SALE"',
      'true',
      '"🍅"',
    ],
    [
      '"Avakaya Mango Pickle"',
      '"Pickles & Thokkus"',
      '"Authentic coastal cut mango pickle steeped in aromatic mustard and pure cold-pressed oil."',
      '"Raw Mangoes, Cold-Pressed Mustard Oil, Guntur & Byadagi Chilli, Fenugreek, Salt."',
      '"Keep in glass jar away from direct sunlight."',
      '"300g:120:145 | 500g:190:230"',
      '190',
      '230',
      '"BESTSELLER"',
      'true',
      '"🥭"',
    ],
    [
      '"Kundapura Ghee Roast Masala Paste"',
      '"Spices & Masalas"',
      '"Slow-roasted Byadagi chillies and aromatic whole spices stone-ground to perfection."',
      '"Byadagi Chillies, Coriander Seeds, Cumin, Pepper, Fennel, Cloves, Pure Ghee."',
      '"Refrigerate after opening."',
      '"250g:220:260 | 500g:390:460"',
      '220',
      '260',
      '"NEW"',
      'true',
      '"🥘"',
    ],
    [
      '"Kundapura Dry Mackerel (Bangude)"',
      '"Dry Fish"',
      '"Sun-dried coastal Karnataka mackerel cleaned, salted, and vacuum-sealed for fresh aroma."',
      '"Fresh Mackerel, Natural Sea Salt."',
      '"Store in dry airtight container or refrigerate."',
      '"250g:240:280 | 500g:450:520"',
      '240',
      '280',
      '""',
      'true',
      '"🐟"',
    ],
  ];

  const csvContent = [
    headers.join(','),
    ...sampleRows.map(row => row.join(',')),
  ].join('\r\n');

  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="vishnu_products_bulk_template.csv"',
      'Cache-Control': 'no-cache',
    },
  });
}
