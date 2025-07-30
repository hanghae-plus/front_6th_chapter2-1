class GetProductListService {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  execute() {
    return this.productRepository.findAll();
  }
}

export default GetProductListService;
