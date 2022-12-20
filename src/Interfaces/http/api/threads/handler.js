const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetDetailThreadUseCase = require('../../../../Applications/use_case/GetDetailThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.addThreadHandler = this.addThreadHandler.bind(this);
    this.getDetailThreadHandler = this.getDetailThreadHandler.bind(this);
  }

  async addThreadHandler(request, h) {
    const headerAuthorization = request.headers.authorization;
    const threadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await threadUseCase.addNewThread(
      request.payload,
      headerAuthorization
    );

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getDetailThreadHandler(request, h) {
    const threadUseCase = this._container.getInstance(
      GetDetailThreadUseCase.name
    );
    const thread = await threadUseCase.getDetailThread(request.params);

    const response = h.response({
      status: 'success',
      data: {
        thread,
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
