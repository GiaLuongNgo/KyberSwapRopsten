- Viết dapp thực hiện logic chuyển đồi token sang token sử dụng Kyber protocol

Yêu cầu:
- Platform sử dụng: react
- List tokens lấy từ API: https://ropsten-api.kyber.network/currencies

- Support ít nhất 1 wallet là Metamask
- Hiển thị balance của từng token 
- Cần hiển thị rate giữa token-token (gọi lến smartcontract)
- Thực hiện logic chuyển đồi token-token (gọi lên smartcontract)

Tham khảo: https://ropsten.kyber.network

smartcontract:
https://ropsten.etherscan.io/address/0x818e6fecd516ecc3849daf6845e3ec868087b755

- getExpectedRate(source, dest, sourceAmount)
- trade(source, dest, srcAmount, destAddress, maxDestAmount, minConversionRate, walletId)
