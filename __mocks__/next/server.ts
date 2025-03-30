export class NextRequest {
  constructor(public url: string) {}
}

export class NextResponse {
  cookies = {
    set: jest.fn(),
    delete: jest.fn(),
  };
}
