import * as handlebars from 'handlebars';

// Helper định dạng tiền tệ VND
handlebars.registerHelper('formatCurrencyVND', function (amount: number) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
});

// Helper tính tổng giá (đơn giá * số lượng)
handlebars.registerHelper('multiply', function (a: number, b: number) {
    return a * b;
});


// Helper hiển thị trạng thái đơn hàng
handlebars.registerHelper('orderStatus', function (status: number) {
    switch (status) {
        case 0:
            return 'Chờ duyệt đơn hàng';
        case 1:
            return 'Chờ vận chuyển';
        case 2:
            return 'Đang giao hàng';
        case 3:
            return 'Giao thành công';
        case 4:
            return 'Giao hàng thất bại';
        default:
            return 'Trạng thái không xác định';
    }
});

// Helper hiển thị màu trạng thái đơn hàng
handlebars.registerHelper('getStatusColor', function (status: number) {
    switch (status) {
        case 0: // Chờ duyệt
            return '#FFA500';
        case 1: // Chờ vận chuyển
            return '#007BFF';
        case 2: // Đang giao hàng
            return '#28A745';
        case 3: // Giao thành công
            return '#218838';
        case 4: // Giao hàng thất bại
            return '#DC3545';
        default:
            return '#333333';
    }
});

// Helper hiển thị hình thức thanh toán
handlebars.registerHelper('getPaymentMethod', function (paymentMethod: string) {
    switch (paymentMethod) {
        case "cod": // Chờ duyệt
            return 'Thanh toán khi nhận hàng';
        case "tt":
            return "Chuyển khoản qua ngân hàng hoặc ví điện tử"
        default:
            return 'Hình thức chưa xác định';
    }
});

export default handlebars;