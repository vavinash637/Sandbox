"""
Setup configuration file for the client_jiva Python egg.

"""

from setuptools import setup, find_packages

version = open('VERSION.txt').read().strip()

setup(name="client_jiva",
      version=version,
      description="",
      packages=find_packages(exclude=["tests"]),
      include_package_data=True,
      zip_safe=False,
      author='ZeOmega',
      namespace_packages=[],
      install_requires=['setuptools',
                        ],
      )
