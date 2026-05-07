/** User-facing copy when POST /api/contacts fails (network or server). */
export function contactSubmitUserMessage(status: number, serverMessage?: string): string {
    const fromServer = typeof serverMessage === 'string' ? serverMessage.trim() : '';
    if (status === 503) {
        return (
            "We can't save your request online right now—the booking system can't reach the database. " +
            'Please call +91 9381040073 or email info@urskinandheart.com, or try again in a few minutes.'
        );
    }
    if (status === 400 && fromServer) return fromServer;
    if (status >= 500) {
        return (
            'Something went wrong on our side. Please try again, or call +91 9381040073 for assistance.'
        );
    }
    if (fromServer) return fromServer;
    return 'Submission failed. Please check your connection and try again.';
}
