<?php

namespace Modules\Account\Services;

use Modules\Account\Repositories\UserRepository;

class UserService
{
    public function __construct(
        protected UserRepository $userRepository
    ) {}

    public function paginate(array $filters)
    {
        return $this->userRepository->paginate($filters);
    }

    public function form($id = null, array $data = [])
    {
        if (empty($id)) {
            return $this->userRepository->stored($data);
        }

        return $this->userRepository->updated($id, $data);
    }

    public function deletion($id)
    {
        return $this->userRepository->deleted($id);
    }
}
