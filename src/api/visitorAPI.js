export function getVisitors(rows) {
    return fetch(`https://epic-gates-a1c2f8.netlify.com/.netlify/functions/getVisits?${rows}`);

}