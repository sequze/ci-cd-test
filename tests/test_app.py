from app import sum

def test_sum():
    assert sum(2, 3) == 5, "2 + 3 should equal 5"
    assert sum(-1, 1) == 0, "-1 + 1 should equal 0"
    print("All tests passed!")

