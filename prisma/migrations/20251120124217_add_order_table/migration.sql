-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bookingCode" TEXT NOT NULL,
    "movieTitle" TEXT NOT NULL,
    "cinema" TEXT NOT NULL,
    "showtime" TEXT NOT NULL,
    "seats" TEXT NOT NULL,
    "totalPrice" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Berhasil',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_bookingCode_key" ON "Order"("bookingCode");
