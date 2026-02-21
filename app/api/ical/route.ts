import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { urls } = await request.json();

        if (!urls || !Array.isArray(urls)) {
            return NextResponse.json({ error: 'Invalid URLs provided' }, { status: 400 });
        }

        const allDates = new Set<string>();

        for (const url of urls) {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    console.error(`Failed to fetch ICAL from ${url}`);
                    continue;
                }

                const icalData = await response.text();
                const events = icalData.split('BEGIN:VEVENT');

                for (let i = 1; i < events.length; i++) {
                    const event = events[i];
                    const dtstartMatch = event.match(/DTSTART(?:;[^:]*)?:(\d{8}(?:T\d{6}Z)?)/);
                    const dtendMatch = event.match(/DTEND(?:;[^:]*)?:(\d{8}(?:T\d{6}Z)?)/);

                    if (dtstartMatch && dtendMatch) {
                        const startStr = dtstartMatch[1];
                        const endStr = dtendMatch[1];

                        const startYear = parseInt(startStr.substring(0, 4));
                        const startMonth = parseInt(startStr.substring(4, 6)) - 1;
                        const startDay = parseInt(startStr.substring(6, 8));

                        const endYear = parseInt(endStr.substring(0, 4));
                        const endMonth = parseInt(endStr.substring(4, 6)) - 1;
                        const endDay = parseInt(endStr.substring(6, 8));

                        const startDate = new Date(startYear, startMonth, startDay);
                        const endDate = new Date(endYear, endMonth, endDay);

                        let currentDate = new Date(startDate);
                        // Disable all intermediate days
                        while (currentDate < endDate) {
                            const yyyy = currentDate.getFullYear();
                            const mm = String(currentDate.getMonth() + 1).padStart(2, '0');
                            const dd = String(currentDate.getDate()).padStart(2, '0');
                            allDates.add(`${yyyy}-${mm}-${dd}`);
                            currentDate.setDate(currentDate.getDate() + 1);
                        }
                    }
                }
            } catch (err) {
                console.error(`Error processing ICAL from ${url}:`, err);
            }
        }

        return NextResponse.json({ dates: Array.from(allDates) });
    } catch (error) {
        console.error('API ICAL Error:', error);
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
}
